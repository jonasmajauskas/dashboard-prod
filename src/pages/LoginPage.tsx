import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle(); // Supabase handles the redirect
    } catch (error) {
      console.error('Google login failed:', (error as Error).message);
    }
  };

  // ✅ Redirect if user already exists
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return null; // Or show a spinner if you want

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between relative">
            <h1 className="eft-1/2 transform -translate-x-1/2 text-lg font-semibold hidden md:block">
              Dashboard
            </h1>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-md p-6 shadow-xl border">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
