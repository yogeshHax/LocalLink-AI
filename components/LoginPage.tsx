import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowLeft, User, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onLogin: () => void;
  onGuestLogin: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Handle Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
            },
          },
        });

        if (error) throw error;
        
        if (data.user && !data.session) {
            setSuccessMsg("Registration successful! Please check your email.");
        } else if (data.session) {
            onLogin();
        }

      } else {
        // Handle Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.session) {
            onLogin();
        }
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "An error occurred.";
      if (msg.includes("Rate limit") || msg.includes("Too many requests")) {
         msg = "Email rate limit exceeded. Please wait or use Guest Mode below.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="inline-block p-3 rounded-full bg-indigo-100 mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isSignUp ? "Join your local community today." : "Enter your credentials or try Guest Mode."}
          </p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center font-medium">
                {successMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required={isSignUp}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-gray-900"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-gray-900"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-gray-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="mt-4">
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button 
                type="button"
                onClick={onGuestLogin}
                className="w-full bg-white border-2 border-indigo-100 hover:border-indigo-300 text-indigo-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center mt-2 group"
            >
                <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Continue as Guest
            </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
                type="button"
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccessMsg(null);
                }} 
                className="text-indigo-600 font-bold cursor-pointer hover:underline ml-1"
            >
                {isSignUp ? "Sign In" : "Sign up for free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;