// src/app/components/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface LoginFormProps {
  setView: (view: 'login' | 'register' | 'forgotPassword') => void;
  onClose: () => void;
  setUser: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setView, onClose, setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }
      localStorage.setItem("supabase_session", JSON.stringify({ user: data.user }));
      setUser(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "!w-full !px-4 !py-3 !bg-white/70 !border !border-white/60 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white focus:!border-transparent !transition-all !text-gray-800 !placeholder-gray-400 !font-medium";
  const labelStyles = "!block !text-sm !font-semibold !text-gray-700 !mb-1.5 !ml-1";
  const btnStyles = "!w-full !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !py-3.5 !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 active:!scale-[0.98] !transition-all !flex !justify-center !items-center !cursor-pointer";

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleLoginSubmit} className="!flex !flex-col !gap-4">
        <div>
          <label className={labelStyles}>Email Address</label>
          <input type="email" name="email" placeholder="hello@example.com" required className={inputStyles} />
        </div>
        <div>
          <label className={labelStyles}>Password</label>
          <input type="password" name="password" placeholder="••••••••" required className={inputStyles} />
        </div>
        
        <div className="!flex !justify-end !-mt-2 !mb-2">
          <button type="button" onClick={() => setView('forgotPassword')} className="!text-sm !font-semibold !text-[#B52222] hover:!text-[#8a1919] !transition-colors !cursor-pointer">
            Forgot Password?
          </button>
        </div>

        <button type="submit" disabled={loading} className={btnStyles}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="!text-center !mt-6">
        <span className="!text-sm !text-gray-500 !font-medium">Don't have an account? </span>
        <button type="button" onClick={() => setView('register')} className="!text-sm !font-bold !text-[#B52222] hover:!underline !cursor-pointer">
          Sign up
        </button>
      </div>

      {/* Divider */}
      <div className="!flex !items-center !gap-3 !my-6">
        <div className="!flex-1 !h-px !bg-gray-300/50"></div>
        <span className="!text-xs !font-semibold !text-gray-400 !uppercase !tracking-wider">or</span>
        <div className="!flex-1 !h-px !bg-gray-300/50"></div>
      </div>

      {/* Admin Login - Less Prominent */}
      <Link href="/admin/login" className="!block !w-full" onClick={onClose}>
        <button type="button" className="!w-full !bg-white/50 !border !border-gray-300/60 !text-gray-600 !font-semibold !rounded-xl !py-3 hover:!bg-white hover:!text-gray-900 !transition-all !text-sm !flex !items-center !justify-center !gap-2 !shadow-sm !cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Login as Admin
        </button>
      </Link>
    </div>
  );
};

export default LoginForm;
