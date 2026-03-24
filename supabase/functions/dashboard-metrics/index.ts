import postgres from "npm:postgres";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, {
    ssl: "require",
    max: 3,
  });

  try {
    const url = new URL(req.url);
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");

    // Build date filter fragment for sessions
    const dateFilterParts: string[] = [];
    if (dateFrom) dateFilterParts.push(`completed_at >= '${dateFrom}'`);
    if (dateTo) dateFilterParts.push(`completed_at <= '${dateTo}'`);
    const dateFilter = dateFilterParts.length
      ? "AND " + dateFilterParts.join(" AND ")
      : "";

    const [
      usersResult,
      sessionsResult,
      completionResult,
      topPracticesResult,
      topFavoritesResult,
      funnelResult,
      abandonmentResult,
      feelingResult,
      streaksResult,
    ] = await Promise.all([
      // 1. Users
      sql.unsafe(`
        SELECT COUNT(*)::int AS total_users,
               COUNT(*) FILTER (WHERE created_at >= date_trunc('week', now()))::int AS new_this_week
        FROM profiles
      `),

      // 2. Sessions
      sql.unsafe(`
        SELECT
          COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE)::int AS today,
          COUNT(*) FILTER (WHERE completed_at >= date_trunc('week', now()))::int AS this_week,
          COUNT(*)::int AS total
        FROM sessions WHERE 1=1 ${dateFilter}
      `),

      // 3. Completion rate
      sql.unsafe(`
        SELECT ROUND(AVG(CASE WHEN estimated_duration_seconds > 0
          THEN LEAST(duration_seconds::numeric / estimated_duration_seconds, 1.0) END) * 100, 1) AS avg_completion_pct
        FROM sessions
        WHERE duration_seconds IS NOT NULL AND estimated_duration_seconds IS NOT NULL ${dateFilter}
      `),

      // 4. Top 5 practices
      sql.unsafe(`
        SELECT s.practice_id, COALESCE(p.display_name, s.practice_name) AS name,
               COALESCE(p.category, 'respiracion') AS category,
               COUNT(*)::int AS times_used, COUNT(DISTINCT s.user_id)::int AS unique_users
        FROM sessions s LEFT JOIN practices p ON p.id = s.practice_id
        WHERE s.practice_id IS NOT NULL ${dateFilter}
        GROUP BY s.practice_id, p.display_name, s.practice_name, p.category
        ORDER BY times_used DESC LIMIT 5
      `),

      // 5. Top favorites
      sql.unsafe(`
        SELECT sp.practice_id, p.display_name AS name,
               p.category, COUNT(*)::int AS saved_count
        FROM saved_practices sp
        JOIN practices p ON p.id = sp.practice_id
        GROUP BY sp.practice_id, p.display_name, p.category
        ORDER BY saved_count DESC LIMIT 10
      `),

      // 6. Program funnel
      sql.unsafe(`
        SELECT COUNT(*)::int AS total_started, ROUND(AVG(current_day), 1) AS avg_current_day,
               COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::int AS total_completed,
               ROUND(COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::numeric / NULLIF(COUNT(*), 0) * 100, 1) AS completion_pct,
               ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 86400) FILTER (WHERE completed_at IS NOT NULL), 1) AS avg_days_to_complete
        FROM user_program_progress
      `),

      // 7. Abandonment
      sql.unsafe(`
        SELECT ROUND(AVG(current_day), 1) AS avg_day_abandoned,
               MODE() WITHIN GROUP (ORDER BY current_day) AS most_common_dropoff
        FROM user_program_progress
        WHERE completed_at IS NULL AND started_at < now() - INTERVAL '7 days'
      `),

      // 8. Feeling distribution
      sql.unsafe(`
        SELECT COALESCE(feeling, 'Sin respuesta') AS feeling,
               COUNT(*)::int AS count,
               ROUND(COUNT(*)::numeric / NULLIF(SUM(COUNT(*)) OVER (), 0) * 100, 1) AS pct
        FROM sessions WHERE 1=1 ${dateFilter}
        GROUP BY feeling ORDER BY count DESC
      `),

      // 9. Streaks
      sql.unsafe(`
        WITH daily AS (
          SELECT user_id, DATE(completed_at AT TIME ZONE 'America/Lima') AS day
          FROM sessions GROUP BY user_id, DATE(completed_at AT TIME ZONE 'America/Lima')
        ), numbered AS (
          SELECT user_id, day, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day) AS rn
          FROM daily
        ), islands AS (
          SELECT user_id, day, (day - rn::int) AS grp FROM numbered
        ), streaks AS (
          SELECT user_id, COUNT(*)::int AS streak_days, MAX(day) AS last_day
          FROM islands GROUP BY user_id, grp
        ), current_streaks AS (
          SELECT user_id, streak_days FROM streaks WHERE last_day >= CURRENT_DATE - INTERVAL '1 day'
        )
        SELECT ROUND(AVG(streak_days), 1) AS avg_streak,
               MAX(streak_days)::int AS max_streak, COUNT(*)::int AS active_users
        FROM current_streaks
      `),
    ]);

    // User list (separate try/catch)
    let userList: unknown[] = [];
    let userListError: string | null = null;
    try {
      userList = await sql.unsafe(`
        SELECT p.user_id, p.display_name, u.email, p.created_at,
               COUNT(s.id)::int AS total_sessions,
               ROUND(COALESCE(SUM(s.duration_seconds), 0) / 60.0, 0)::int AS total_minutes,
               MAX(s.completed_at) AS last_session_at
        FROM profiles p
        JOIN auth.users u ON u.id = p.user_id
        LEFT JOIN sessions s ON s.user_id = p.user_id
        GROUP BY p.user_id, p.display_name, u.email, p.created_at
        ORDER BY p.created_at DESC
      `);
    } catch (e) {
      userListError = e instanceof Error ? e.message : String(e);
    }

    const u = usersResult[0];
    const s = sessionsResult[0];
    const c = completionResult[0];
    const f = funnelResult[0];
    const a = abandonmentResult[0];
    const st = streaksResult[0];

    const result = {
      users: {
        total: u.total_users ?? 0,
        new_this_week: u.new_this_week ?? 0,
      },
      sessions: {
        today: s.today ?? 0,
        this_week: s.this_week ?? 0,
        total: s.total ?? 0,
        completion_rate_pct: Number(c.avg_completion_pct) || 0,
      },
      top_practices: topPracticesResult.map((r: any) => ({
        name: r.name,
        category: r.category,
        times_used: r.times_used,
        unique_users: r.unique_users,
      })),
      top_favorites: topFavoritesResult.map((r: any) => ({
        name: r.name,
        category: r.category,
        saved_count: r.saved_count,
      })),
      program_funnel: {
        total_started: f.total_started ?? 0,
        avg_current_day: Number(f.avg_current_day) || 0,
        total_completed: f.total_completed ?? 0,
        completion_pct: Number(f.completion_pct) || 0,
        avg_days_to_complete: Number(f.avg_days_to_complete) || 0,
      },
      abandonment: {
        avg_day: Number(a.avg_day_abandoned) || 0,
        most_common_day: a.most_common_dropoff ?? 0,
      },
      feeling_distribution: feelingResult.map((r: any) => ({
        feeling: r.feeling,
        count: r.count,
        pct: Number(r.pct) || 0,
      })),
      streaks: {
        avg: Number(st.avg_streak) || 0,
        max: st.max_streak ?? 0,
        active_users: st.active_users ?? 0,
      },
      user_list: (userList as any[]).map((r: any) => ({
        user_id: r.user_id,
        display_name: r.display_name,
        email: r.email,
        created_at: r.created_at,
        total_sessions: r.total_sessions,
        total_minutes: r.total_minutes,
        last_session_at: r.last_session_at,
      })),
      user_list_error: userListError,
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } finally {
    await sql.end();
  }
});
