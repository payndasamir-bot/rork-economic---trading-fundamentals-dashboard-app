import createContextHook from '@nkzw/create-context-hook';
import { Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Signing in:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', error.message);
      throw error;
    }
    console.log('Sign in success:', data.user?.email);
    return data;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('Signing up:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Sign up error:', error.message);
      throw error;
    }
    console.log('Sign up success:', data.user?.email);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
    console.log('Sign out success');
  }, []);

  return useMemo(
    () => ({
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, loading, signIn, signUp, signOut]
  );
});
