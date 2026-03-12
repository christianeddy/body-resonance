import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Practice = {
  id: string;
  name: string;
  display_name: string;
  category: string;
  intention: string | null;
  technique: string | null;
  duration_estimated: string | null;
  intensity: string | null;
  media_mode: string;
  media_url: string | null;
  for_profile: string;
  phases: any;
  tags: any;
  sort_order: number;
  premium: boolean;
};

export const usePractices = (category?: string, intention?: string) => {
  return useQuery({
    queryKey: ["practices", category, intention],
    queryFn: async () => {
      let query = supabase
        .from("practices")
        .select("*")
        .order("sort_order", { ascending: true });

      if (category) query = query.eq("category", category);
      if (intention) query = query.eq("intention", intention);

      const { data, error } = await query;
      if (error) throw error;
      return data as Practice[];
    },
  });
};

export const usePractice = (id: string | undefined) => {
  return useQuery({
    queryKey: ["practice", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("practices")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Practice;
    },
    enabled: !!id,
  });
};
