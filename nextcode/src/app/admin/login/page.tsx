// src/app/admin/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'admin' | 'seller'>('admin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    try {
      if (tab === 'admin') {
        // Admin Login Logic
        if (email === "admin@japura.edu" && password === "1234") {
          localStorage.setItem("admin_user_role", "admin");
          localStorage.setItem("admin_user_email", email);
          localStorage.setItem("canteen_id", "root_admin"); // dummy value for root admin
          router.push("/admin");
        } else {
          setError("Invalid admin credentials");
        }
      } else {
        // Seller Login Logic
        const res = await fetch("/admin/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        const result = await res.json();
    
        if (!res.ok) {
          setError(result.error || "Login failed");
          setLoading(false);
          return;
        }
    
        localStorage.setItem("admin_user_role", result.profile.role);
        localStorage.setItem("admin_user_email", result.profile.email);
        localStorage.setItem("canteen_id", result.profile.canteen_id);
    
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      if (tab === 'admin' && email === "admin@japura.edu" && password === "1234") {
        // Do not set loading to false if we are redirecting to avoid flashing
      } else {
        setLoading(false);
      }
    }
  };

  const inputStyles = "!w-full !px-4 !py-3 !bg-white/70 !border !border-white/60 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white focus:!border-transparent !transition-all !text-gray-800 placeholder-!text-gray-400 !font-medium";
  const labelStyles = "!block !text-sm !font-semibold !text-gray-700 !mb-1.5 !ml-1";
  const btnStyles = "!w-full !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !py-3.5 !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 active:!scale-[0.98] !transition-all !flex !justify-center !items-center !cursor-pointer";

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-black/60 !backdrop-blur-md !p-4 !transition-opacity !duration-300" style={{ backgroundImage: 'url(/landing/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
      
      <div className="!relative !bg-white/80 !backdrop-blur-xl !rounded-[32px] !shadow-[0_8px_32px_rgba(0,0,0,0.15)] !border !border-white/60 !p-8 !w-full !max-w-[420px] !transform !transition-all !overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="!text-center !mb-8">
          <div className="!flex !justify-center !mb-1">
            <Image src="/landing/logo.png" width={90} height={90} alt="Japura Eats" className="!object-contain" />
          </div>
          
          <h2 className="!text-2xl !font-extrabold !text-gray-900 !tracking-tight !mt-2">
            Portal Access
          </h2>
          <p className="!text-sm !text-gray-500 !mt-1.5 !font-medium">
            Sign in to manage Japura Eats
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="!flex !bg-white/50 !p-1.5 !rounded-xl !border !border-white/60 !shadow-sm !mb-6">
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            className={`!flex-1 !py-2.5 !text-sm !font-semibold !rounded-lg !transition-all !cursor-pointer ${tab === 'admin' ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!bg-white/50'}`}
          >
            System Admin
          </button>
          <button
            onClick={() => { setTab('seller'); setError(''); }}
            className={`!flex-1 !py-2.5 !text-sm !font-semibold !rounded-lg !transition-all !cursor-pointer ${tab === 'seller' ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!bg-white/50'}`}
          >
            Canteen Owner
          </button>
        </div>

        {/* Login Form */}
        <div className="!relative animate-fade-in">
          <form onSubmit={handleLogin} className="!flex !flex-col !gap-4">
            
            {error && (
              <div className="!bg-red-50/80 !backdrop-blur-sm !border-l-4 !border-red-500 !text-red-800 !p-3 !rounded-md" role="alert">
                <p className="!font-semibold !text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className={labelStyles}>Email Address</label>
              <input
                type="email"
                placeholder={tab === 'admin' ? "admin@japura.edu" : "seller@example.com"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
              />
            </div>

            <div>
              <label className={labelStyles}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles}
              />
            </div>

            <button type="submit" disabled={loading} className={`${btnStyles} !mt-2`}>
              {loading ? 'Authenticating...' : (tab === 'admin' ? 'Login as Admin' : 'Login as Seller')}
            </button>
          </form>

          {/* Divider */}
          <div className="!flex !items-center !gap-3 !my-6">
            <div className="!flex-1 !h-px !bg-gray-300/50"></div>
            <span className="!text-xs !font-semibold !text-gray-400 !uppercase !tracking-wider">or</span>
            <div className="!flex-1 !h-px !bg-gray-300/50"></div>
          </div>

          {/* Go to Client Website */}
          <Link href="/" className="!block !w-full">
            <button type="button" className="!w-full !bg-white/50 !border !border-gray-300/60 !text-gray-600 !font-semibold !rounded-xl !py-3 hover:!bg-white hover:!text-gray-900 !transition-all !text-sm !flex !items-center !justify-center !gap-2 !shadow-sm !cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Go to Client Website
            </button>
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
};

export default LoginPage;