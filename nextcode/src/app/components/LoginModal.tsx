// src/app/components/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUser: (user: User) => void;
}

// --- CONSTANTS ---
const RED_COLOR = '#B52222';
const JAPURA_EATS_COLOR = '#AA2B2B';
const INPUT_BG_COLOR = '#EAEAEA';
const BUTTON_BG_COLOR = '#A22B2D';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, setUser }) => {
  // State now manages three possible views
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');

  if (!isOpen) return null;

  

  const commonInputStyle = { 
    paddingTop: '0.75rem', 
    paddingBottom: '0.75rem',
    paddingLeft: '1rem', 
    paddingRight: '1rem', 
    backgroundColor: INPUT_BG_COLOR,
    fontSize: '0.9rem',
    border: 'none',
  };

  // --- DYNAMIC HEADER CONTENT ---
  let titleComponent;
  let subtitleComponent;
  let maxWidth = 'max-w-sm'; 

  if (view === 'login') {
    titleComponent = (
      <>
        Login to{' '}
        <span style={{ color: JAPURA_EATS_COLOR }}>JAPURA EATS</span>
      </>
    );
    subtitleComponent = (
      <p className="text-sm text-gray-600">
        Enter Your Credential to Access Your JAPURA EATS Account.
      </p>
    );
  } else if (view === 'register') {
    titleComponent = (
      <>
        Create Account
      </>
    );
    subtitleComponent = (
      <p className="text-sm text-gray-600">
        Register To Start Ordering From{' '}
        <span style={{ color: JAPURA_EATS_COLOR, fontWeight: 'bold' }}>JAPURA EATS</span>
      </p>
    );
    maxWidth = 'max-w-md'; // Wider view for the Register form
  } else { // forgotPassword view
    titleComponent = (
      <>
        Forgot Password
      </>
    );
    subtitleComponent = (
      <p className="text-sm text-gray-600">
        Reset Your Password for{' '}
        <span style={{ color: JAPURA_EATS_COLOR, fontWeight: 'bold' }}>JAPURA EATS</span>
      </p>
    );
  }

  // --- DYNAMIC FORM RENDERING FUNCTIONS ---

  const renderLoginForm = () => {
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
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
  
        // Save session locally
        localStorage.setItem("supabase_session", JSON.stringify({ user: data.user }));
  
        setUser(data.user);      // update Header state
        onClose();               // close modal after login
        alert("Login successful!");
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    };
    
    if (!isOpen) return null;
    return <>
      <form 
        onSubmit={handleFormSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {/* Email Field */}
        <div className="w-full">
          <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400"
            style={commonInputStyle}
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            required
            className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400"
            style={commonInputStyle}
          />
        </div>

        {/* Forgot Password Link (NAVIGATES TO FORGOT PASSWORD VIEW) */}
        <div className="text-right" style={{ marginTop: '-0.75rem', marginBottom: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => setView('forgotPassword')}
            className="text-sm hover:underline text-gray-600"
            style={{ padding: '0', background: 'none', border: 'none' }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full text-white font-bold rounded-md shadow-md transition-colors"
          style={{ 
              backgroundColor: RED_COLOR,
              paddingTop: '1rem', 
              paddingBottom: '1rem', 
              fontSize: '1.25rem', 
              marginTop: '0rem', 
          }}
        >
          LOGIN
        </button>
      </form>

      {/* Register Link (SWITCHES VIEW) */}
      <div className="text-center text-sm text-gray-600" style={{ marginTop: '1.25rem' }}>
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={()=> setView('register')}
          className="font-semibold hover:underline" 
          style={{ color: RED_COLOR, padding: '0', background: 'none', border: 'none' }}
        >
          Register
        </button>
      </div>
      <Link href={"/admin"}><button
          type="submit"
          className="w-full text-white font-bold rounded-md shadow-md transition-colors"
          style={{ 
              backgroundColor: RED_COLOR,
              marginTop: '1rem',
              paddingTop: '1rem', 
              paddingBottom: '1rem', 
              fontSize: '1.25rem', 
          }}
        >
          LOGIN as Admin
        </button></Link>
    </>
  }

  const renderRegisterForm = () => {
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const formData = new FormData(e.currentTarget);
      const role = formData.get("role") as string;
      const full_name = formData.get("full_name") as string;
      const email = formData.get("email") as string;
      const mobile = formData.get("mobile") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
  
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, full_name, email, mobile, password }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          alert(data.message || "Registration failed");
          return;
        }
  
        alert("Registration successful!");
        setView("login"); // optional: switch to login view
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    };
  
    return (
      <>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role radio buttons */}
            <div className="w-full" style={{ marginBottom: '0.5rem' }}>
              <div className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.5rem' }}>
                I am a
              </div>
              <div className="flex gap-4">
                {["student", "lecturer", "staff"].map((roleOption) => (
                  <label key={roleOption} className="flex items-center text-base font-medium text-gray-800">
                    <input type="radio" name="role" value={roleOption} defaultChecked={roleOption === "student"} className="mr-2" style={{ accentColor: RED_COLOR }} />
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </label>
                ))}
              </div>
            </div>
  
            {/* Other fields */}
            <input type="text" name="full_name" placeholder="Enter your full name" required className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400" style={commonInputStyle} />
            <input type="email" name="email" placeholder="Enter your email" required className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400" style={commonInputStyle} />
            <input type="tel" name="mobile" placeholder="Enter your phone number" required className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400" style={commonInputStyle} />
            <input type="password" name="password" placeholder="Enter your password" required className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400" style={commonInputStyle} />
            <input type="password" name="confirmPassword" placeholder="Confirm your password" required className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400" style={commonInputStyle} />
  
            <button
              type="submit"
              className="w-full text-white font-bold rounded-md shadow-md transition-colors"
              style={{ backgroundColor: RED_COLOR, paddingTop: '1rem', paddingBottom: '1rem', fontSize: '1.25rem' }}
            >
              REGISTER
            </button>
          </form>
        </div>
  
        <div className="text-center text-sm text-gray-600" style={{ marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => setView('login')} 
            className="font-semibold hover:underline" 
            style={{ color: RED_COLOR, padding: '0', background: 'none', border: 'none' }}
          >
            Login
          </button>
        </div>
      </>
    );
  };
  

  const renderForgotPasswordForm = () => (
    <>
      <form 
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {/* Email Field */}
        <div className="w-full">
          <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-400"
            style={commonInputStyle}
          />
        </div>

        {/* Reset Button */}
        <button
          type="submit"
          className="w-full text-white font-bold rounded-md shadow-md transition-colors"
          style={{ 
              backgroundColor: BUTTON_BG_COLOR, 
              paddingTop: '1rem', 
              paddingBottom: '1rem', 
              fontSize: '1.25rem', 
              marginTop: '1.5rem',
          }}
        >
          RESET NOW
        </button>
      </form>

      {/* Or Login Link */}
      <div className="text-center text-sm text-gray-600" style={{ marginTop: '0.5rem' }}>
        Or{' '}
        <button 
          type="button" 
          onClick={() => setView('login')} // Switch view back to login
          className="hover:underline" 
          style={{ color: '#000000', padding: '0', background: 'none', border: 'none' }}
        >
          Login
        </button>
      </div>
    </>
  );

  return (
    // Modal Overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-black))]/[0.69]"
      onClick={onClose} 
    >
      {/* Modal Content */}
      <div
        className={`bg-white rounded-lg shadow-2xl w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '2rem' }}
      >
        
        {/* Header Section */}
        <div 
          className="flex justify-between items-start" 
          style={{ marginBottom: '1.5rem' }}
        >
          {/* Title and Subtitle */}
          <div style={{ paddingRight: '1rem' }}>
            <h2 
              className={`font-bold text-gray-800 ${inter.className}`} 
              style={{ 
                marginBottom: '0.25rem', 
                fontSize: '25px', 
                color: '#000000'
              }}
            >
              {titleComponent}
            </h2>
            {subtitleComponent}
          </div>

          {/* Top Right Logo */}
          <Image
            src={"/landing/logo.png"}
            width={70}
            height={70}
            alt="JAPURA EATS Logo"
            className="flex-shrink-0"
          />
        </div>
        
        {/* --- DYNAMIC FORM RENDERING --- */}
        {view === 'login' && renderLoginForm()}
        {view === 'register' && renderRegisterForm()}
        {view === 'forgotPassword' && renderForgotPasswordForm()}
        
      </div>
    </div>
  );
};

export default LoginModal;