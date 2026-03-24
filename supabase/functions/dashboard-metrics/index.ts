import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const weekStart = getWeekStart();
    const { count: newThisWeek } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart);

    // 2. Onboarding
    const { count: onboardingCompleted } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("onboarding_completed", true);

    const onboardingTotal = totalUsers ?? 0;
    const onboardingPct =
      onboardingTotal > 0
        ? Math.round(((onboardingCompleted ?? 0) / onboardingTotal) * 100)
        : 0;

    // 3. Sessions
    const todayStart = getTodayStart();
    const { count: sessionsToday } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .gte("completed_at", todayStart);

    const { count: sessionsThisWeek } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .gte("completed_at", weekStart);

    let sessionsQuery = supabase
      .from("sessions")
      .select("*", { count: "exact", head: true });
    if (dateFrom) sessionsQuery = sessionsQuery.gte("completed_at", dateFrom);
    if (dateTo) sessionsQuery = sessionsQuery.lte("completed_at", dateTo);
    const { count: sessionsTotal } = await sessionsQuery;

    // 4. Completion rate — need raw data
    let completionQuery = supabase
      .from("sessions")
      .select("duration_seconds, estimated_duration_seconds")
      .not("duration_seconds", "is", null)
      .not("estimated_duration_seconds", "is", null)
      .gt("estimated_duration_seconds", 0);
    if (dateFrom) completionQuery = completionQuery.gte("completed_at", dateFrom);
    if (dateTo) completionQuery = completionQuery.lte("completed_at", dateTo);
    const { data: completionData } = await completionQuery;

    let completionPct = 0;
    const sessionsWithEstimate = completionData?.length ?? 0;
    if (completionData && completionData.length > 0) {
      const sum = completionData.reduce((acc, s) => {
        const ratio = Math.min(s.duration_seconds! / s.estimated_duration_seconds!, 1.0);
        return acc + ratio;
      }, 0);
      completionPct = Math.round((sum / completionData.length) * 100);
    }

    // 5. Top practices
    let topPracticesQuery = supabase
      .from("sessions")
      .select("practice_id, practice_name, user_id");
    if (dateFrom) topPracticesQuery = topPracticesQuery.gte("completed_at", dateFrom);
    if (dateTo) topPracticesQuery = topPracticesQuery.lte("completed_at", dateTo);
    const { data: sessionsForTop } = await topPracticesQuery;

    const { data: allPractices } = await supabase
      .from("practices")
      .select("id, display_name, category");

    const practiceMap = new Map(
      (allPractices ?? []).map((p) => [p.id, { name: p.display_name, category: p.category }])
    );

    const practiceStats = new Map<
      string,
      { name: string; category: string; count: number; users: Set<string> }
    >();
    for (const s of sessionsForTop ?? []) {
      const key = s.practice_id ?? s.practice_name ?? "unknown";
      const info = practiceMap.get(s.practice_id ?? "");
      if (!practiceStats.has(key)) {
        practiceStats.set(key, {
          name: info?.name ?? s.practice_name ?? key,
          category: info?.category ?? "desconocida",
          count: 0,
          users: new Set(),
        });
      }
      const stat = practiceStats.get(key)!;
      stat.count++;
      stat.users.add(s.user_id);
    }
    const topPractices = [...practiceStats.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((s) => ({
        name: s.name,
        category: s.category,
        times_used: s.count,
        unique_users: s.users.size,
      }));

    // 6. Top favorites
    const { data: savedData } = await supabase
      .from("saved_practices")
      .select("practice_id");

    const favStats = new Map<string, number>();
    for (const f of savedData ?? []) {
      favStats.set(f.practice_id, (favStats.get(f.practice_id) ?? 0) + 1);
    }
    const topFavorites = [...favStats.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pid, count]) => {
        const info = practiceMap.get(pid);
        return {
          name: info?.name ?? pid,
          category: info?.category ?? "desconocida",
          saved_count: count,
        };
      });

    // 7. Program funnel
    const { data: progressData } = await supabase
      .from("user_program_progress")
      .select("current_day, completed_at, started_at, completed_days");

    const totalStarted = progressData?.length ?? 0;
    const completed = (progressData ?? []).filter((p) => p.completed_at !== null);
    const totalCompleted = completed.length;
    const avgCurrentDay =
      totalStarted > 0
        ? Math.round(
            (progressData ?? []).reduce((a, p) => a + p.current_day, 0) / totalStarted
          )
        : 0;
    const completionPctProgram =
      totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0;

    let avgDaysToComplete = 0;
    if (completed.length > 0) {
      const totalDays = completed.reduce((acc, p) => {
        const start = new Date(p.started_at).getTime();
        const end = new Date(p.completed_at!).getTime();
        return acc + (end - start) / (1000 * 60 * 60 * 24);
      }, 0);
      avgDaysToComplete = Math.round(totalDays / completed.length);
    }

    // 8. Abandonment
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const abandoned = (progressData ?? []).filter(
      (p) => p.completed_at === null && p.started_at < sevenDaysAgo
    );
    const avgAbandonDay =
      abandoned.length > 0
        ? Math.round(abandoned.reduce((a, p) => a + p.current_day, 0) / abandoned.length)
        : 0;

    const dayCount = new Map<number, number>();
    for (const a of abandoned) {
      dayCount.set(a.current_day, (dayCount.get(a.current_day) ?? 0) + 1);
    }
    let mostCommonDay = 0;
    let maxDayCount = 0;
    for (const [day, c] of dayCount) {
      if (c > maxDayCount) {
        mostCommonDay = day;
        maxDayCount = c;
      }
    }

    // 9. Feeling distribution
    let feelingQuery = supabase.from("sessions").select("feeling");
    if (dateFrom) feelingQuery = feelingQuery.gte("completed_at", dateFrom);
    if (dateTo) feelingQuery = feelingQuery.lte("completed_at", dateTo);
    const { data: feelingData } = await feelingQuery;

    const feelingMap = new Map<string, number>();
    for (const f of feelingData ?? []) {
      const key = f.feeling ?? "Sin respuesta";
      feelingMap.set(key, (feelingMap.get(key) ?? 0) + 1);
    }
    const feelingTotal = feelingData?.length ?? 0;
    const feelingDistribution = [...feelingMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([feeling, count]) => ({
        feeling,
        count,
        pct: feelingTotal > 0 ? Math.round((count / feelingTotal) * 100) : 0,
      }));

    // 10. Streaks — island gap detection
    let streakQuery = supabase
      .from("sessions")
      .select("user_id, completed_at")
      .order("completed_at", { ascending: true });
    if (dateFrom) streakQuery = streakQuery.gte("completed_at", dateFrom);
    if (dateTo) streakQuery = streakQuery.lte("completed_at", dateTo);
    const { data: streakData } = await streakQuery;

    const userDays = new Map<string, Set<string>>();
    for (const s of streakData ?? []) {
      if (!userDays.has(s.user_id)) userDays.set(s.user_id, new Set());
      // Convert to Lima timezone day
      const day = toLimaDate(s.completed_at);
      userDays.get(s.user_id)!.add(day);
    }

    let totalStreakSum = 0;
    let maxStreak = 0;
    let userCount = 0;
    let activeUsers = 0;
    const todayLima = toLimaDate(new Date().toISOString());
    const yesterdayLima = toLimaDate(
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

    for (const [, days] of userDays) {
      userCount++;
      const sorted = [...days].sort();
      let currentStreak = 1;
      let bestStreak = 1;

      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]).getTime();
        const curr = new Date(sorted[i]).getTime();
        const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

        if (diffDays <= 2) {
          // 1 day grace
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        bestStreak = Math.max(bestStreak, currentStreak);
      }

      totalStreakSum += bestStreak;
      maxStreak = Math.max(maxStreak, bestStreak);

      // Active if practiced today or yesterday
      if (days.has(todayLima) || days.has(yesterdayLima)) {
        activeUsers++;
      }
    }

    const avgStreak = userCount > 0 ? Math.round(totalStreakSum / userCount) : 0;

    const result = {
      users: { total: totalUsers ?? 0, new_this_week: newThisWeek ?? 0 },
      onboarding: {
        total: onboardingTotal,
        completed: onboardingCompleted ?? 0,
        pct: onboardingPct,
      },
      sessions: {
        today: sessionsToday ?? 0,
        this_week: sessionsThisWeek ?? 0,
        total: sessionsTotal ?? 0,
      },
      completion_rate: { pct: completionPct, sessions_with_estimate: sessionsWithEstimate },
      top_practices: topPractices,
      top_favorites: topFavorites,
      program_funnel: {
        total_started: totalStarted,
        avg_current_day: avgCurrentDay,
        total_completed: totalCompleted,
        completion_pct: completionPctProgram,
        avg_days_to_complete: avgDaysToComplete,
      },
      abandonment: { avg_day: avgAbandonDay, most_common_day: mostCommonDay },
      feeling_distribution: feelingDistribution,
      streaks: { avg: avgStreak, max: maxStreak, active_users: activeUsers },
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

function getTodayStart(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

function toLimaDate(iso: string): string {
  const d = new Date(iso);
  // Lima is UTC-5
  const lima = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  return lima.toISOString().split("T")[0];
}
