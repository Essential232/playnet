import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/../lib/supabase';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

const authRedirectUrl = 'playnet://';

function getCallbackParams(url: string) {
  const parsedUrl = new URL(url);
  const hash = new URLSearchParams(parsedUrl.hash.replace(/^#/, ''));
  return {
    accessToken: hash.get('access_token') ?? parsedUrl.searchParams.get('access_token'),
    refreshToken: hash.get('refresh_token') ?? parsedUrl.searchParams.get('refresh_token'),
    error: hash.get('error_description') ?? parsedUrl.searchParams.get('error_description'),
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return;
      if (sessionError) setError(getErrorMessage(sessionError));
      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsLoading(false);
      setError(null);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      error,
      async signIn(email, password) {
        setError(null);
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(getErrorMessage(signInError));
          throw signInError;
        }
      },
      async signInWithGoogle() {
        setError(null);
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: authRedirectUrl,
            skipBrowserRedirect: Platform.OS !== 'web',
          },
        });

        if (oauthError) {
          setError(getErrorMessage(oauthError));
          throw oauthError;
        }

        if (Platform.OS === 'web') return;

        const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectUrl);
        if (result.type !== 'success') {
          throw new Error('Google sign-in was cancelled.');
        }

        const { accessToken, refreshToken, error: callbackError } = getCallbackParams(result.url);
        if (callbackError) {
          setError(callbackError);
          throw new Error(callbackError);
        }
        if (!accessToken || !refreshToken) {
          throw new Error('Google sign-in did not return a valid session.');
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setError(getErrorMessage(sessionError));
          throw sessionError;
        }
      },
      async signUp(email, password) {
        setError(null);
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(getErrorMessage(signUpError));
          throw signUpError;
        }
        return Boolean(data.session);
      },
      async signOut() {
        setError(null);
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          setError(getErrorMessage(signOutError));
          throw signOutError;
        }
      },
    }),
    [error, isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
