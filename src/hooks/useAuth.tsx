
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return profile;
    },
  });

  const signUp = useMutation({
    mutationFn: async ({ email, password, firstName, lastName, role = 'agent' }: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          },
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    },
  });

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
