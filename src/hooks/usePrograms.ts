import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("id");
      if (error) throw error;
      return data;
    },
  });
};

export const useProgram = (id: string | undefined) => {
  return useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useProgramProgress = (programId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["program-progress", user?.id, programId],
    queryFn: async () => {
      if (!user || !programId) return null;
      const { data } = await supabase
        .from("user_program_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("program_id", programId)
        .maybeSingle();
      return data;
    },
    enabled: !!user && !!programId,
  });
};

export const useAllProgramProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-program-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_program_progress")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
