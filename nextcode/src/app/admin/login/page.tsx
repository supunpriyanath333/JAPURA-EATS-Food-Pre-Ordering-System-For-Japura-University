"use client";

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

// --- Mock useRouter for standalone environments ---
const useRouter = () => ({
    push: (path: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = path; 
        }
    }
});

// --- CONSTANTS ---
const RED_COLOR = '#B52222';
const JAPURA_EATS_COLOR = '#AA2B2B';
const INPUT_BG_COLOR = '#F9FAFB'; // Very light grey background for inputs
const CARD_BG_COLOR = '#FFFFFF';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();


  const handleSellerLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
  
    try {
      // Check for root admin
      if (email === "admin@japura.edu" && password === "1234") {
        localStorage.setItem("admin_user_role", "admin");
        localStorage.setItem("admin_user_email", email);
        localStorage.setItem("canteen_id", "root_admin"); // dummy value for root admin
  
        router.push("/admin");
        return;
      }
  
      // Normal login for other sellers
      const res = await fetch("/admin/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        setError(result.error || "Login failed");
        return;
      }
  
      // Save role & email for seller
      localStorage.setItem("admin_user_role", result.profile.role); // should be "seller"
      localStorage.setItem("admin_user_email", result.profile.email);
      localStorage.setItem("canteen_id", result.profile.canteen_id);
  
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication check
    const { user, error: authError, profile } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else if (user && profile) {
      // Store profile data (in a real app, use sessions or context)
      localStorage.setItem('admin_user_role', profile.role);
      localStorage.setItem('admin_user_email', email);
      
      // Redirect to the main dashboard
      router.push('/admin');
    } else {
        setError('Invalid login credentials or profile data missing.');
    }
    setLoading(false);
  };

  const commonInputStyle: React.CSSProperties = { 
    padding: '0.85rem 1.25rem', // Increased padding
    backgroundColor: INPUT_BG_COLOR,
    fontSize: '1rem',
    border: '1px solid #E5E7EB', // Lighter border
    borderRadius: '0.5rem', // Medium rounded corners
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{ 
            padding: '2.5rem', 
            backgroundColor: CARD_BG_COLOR,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Stronger shadow
        }}
      >
        
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
            {/* Replaced Next.js <Image> with standard <img> */}
            <img
                src={"/landing/logo.png"} 
                width={70}
                height={70}
                alt="JAPURA EATS Logo"
                className="mx-auto"
                style={{ width: 70, height: 70, marginBottom: '1.5rem' }}
            />
            <h2 
                className="font-extrabold text-center text-gray-900" 
                style={{ 
                    fontSize: '2rem', 
                    marginBottom: '0.5rem'
                }}
            >
                Sign In
            </h2>
        </div>

        <div
  style={{
    backgroundColor: "#fff",
    border: `2px solid ${RED_COLOR}`,
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "500px",
    margin: "2rem auto",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  }}
>
  <h2
    style={{
      color: RED_COLOR,
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      textAlign: "center",
    }}
  >
    Admin & Seller Credentials
  </h2>

  {/* Admin */}
  <div style={{ marginBottom: "1.5rem" }}>
    <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0.5rem" }}>
      Admin Root Email:
    </p>
    <p style={{ color: RED_COLOR, fontWeight: "bold" }}>admin@japura.edu</p>

    <p style={{ fontWeight: "bold", color: "#333", marginTop: "1rem", marginBottom: "0.5rem" }}>
      Admin Root Password:
    </p>
    <p style={{ color: RED_COLOR, fontWeight: "bold" }}>1234</p>
  </div>

  {/* Seller */}
  <div>
    <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0.5rem" }}>
      Seller Email:
    </p>
    <p style={{ color: RED_COLOR, fontWeight: "bold" }}>Seller Email</p>

    <p style={{ fontWeight: "bold", color: "#333", marginTop: "1rem", marginBottom: "0.5rem" }}>
      Seller Password:
    </p>
    <p style={{ color: RED_COLOR, fontWeight: "bold" }}>Canteen Name</p>
  </div>
</div>

        
        {/* Login Form */}
        <form 
          onSubmit={handleSellerLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
              <p className="font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '0.35rem' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@japura.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full focus:ring-red-400 focus:border-red-400"
              style={commonInputStyle}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:ring-red-400 focus:border-red-400"
              style={commonInputStyle}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
                backgroundColor: RED_COLOR,
                padding: '1rem',
                fontSize: '1.1rem', 
                marginTop: '0.5rem', 
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
        <h4 className='text-center' style={{marginTop: "1rem"}}>or</h4>
        {/* Login Button */}
        <Link href={"/"}><button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
                backgroundColor: RED_COLOR,
                padding: '1rem',
                fontSize: '1.1rem', 
                marginTop: '1.5rem', 
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO CLIENT WEB PAGE'}
          </button></Link>
      </div>
    </div>
  );
};

export default LoginPage;