import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserType {
  name: string;
  email: string | undefined;
  [key: string]: any;
}

interface AuthContextType {
  user: UserType | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching session user:', error.message);
      setUser(null);
    } else if (data.user) {
      const { id: userId, email, user_metadata } = data.user;
      const name = user_metadata?.name || email?.split('@')[0] || 'User';
        console.log('AuthProvider', data);

      setUser({
        name,
        email,
        userId,
        sessionUser: data.user,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.provider_token) {
        window.localStorage.setItem('oauth_provider_token', session.provider_token);
      }

      if (session?.provider_refresh_token) {
        window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token);
      }

      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('oauth_provider_token');
        window.localStorage.removeItem('oauth_provider_refresh_token');
        setUser(null);
        return;
      }

      if (event !== 'INITIAL_SESSION') {
        fetchUser();
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Logging in...</p>
        <Loader className="animate-spin w-5 h-5 text-primary ml-1" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
