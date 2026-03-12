import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_practices")
        .select("practice_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((d) => d.practice_id);
    },
    enabled: !!user,
  });

  return query;
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ practiceId, isFavorite }: { practiceId: string; isFavorite: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isFavorite) {
        const { error } = await supabase
          .from("saved_practices")
          .delete()
          .eq("user_id", user.id)
          .eq("practice_id", practiceId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_practices")
          .insert({ user_id: user.id, practice_id: practiceId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
