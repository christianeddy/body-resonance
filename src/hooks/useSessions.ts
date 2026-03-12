import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSessionStats = () => {
  const { data: sessions } = useSessions();

  const totalSessions = sessions?.length ?? 0;
  const totalMinutes = sessions
    ? Math.round(sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60)
    : 0;

  // Calculate streak
  let streak = 0;
  if (sessions && sessions.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMs = 86400000;

    const sessionDays = new Set(
      sessions.map((s) => {
        const d = new Date(s.completed_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    let checkDay = today.getTime();
    // If no session today, start from yesterday
    if (!sessionDays.has(checkDay)) checkDay -= dayMs;

    while (sessionDays.has(checkDay)) {
      streak++;
      checkDay -= dayMs;
    }
  }

  // Most used practice
  const practiceCount: Record<string, { name: string; count: number }> = {};
  sessions?.forEach((s) => {
    if (s.practice_name) {
      if (!practiceCount[s.practice_name]) practiceCount[s.practice_name] = { name: s.practice_name, count: 0 };
      practiceCount[s.practice_name].count++;
    }
  });
  const mostUsed = Object.values(practiceCount).sort((a, b) => b.count - a.count)[0]?.name ?? null;

  return { totalSessions, totalMinutes, streak, mostUsed, sessions };
};

export const useSaveSession = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: {
      practice_id: string;
      practice_name: string;
      duration_seconds: number;
      estimated_duration_seconds?: number;
      feeling?: string;
      ice_duration_minutes?: number;
      temperature?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("sessions").insert({
        user_id: user.id,
        ...session,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
