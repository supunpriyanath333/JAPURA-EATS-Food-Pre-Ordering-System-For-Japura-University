// src/app/components/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google'; 
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

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

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, setUser }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');

  if (!isOpen) return null;

  return (
    <div className={`!fixed !inset-0 !z-[100] !flex !items-center !justify-center !bg-black/40 !backdrop-blur-md !p-4 !transition-opacity !duration-300 ${inter.className}`}>
      
      {/* Click outside to close */}
      <div className="!absolute !inset-0" onClick={onClose}></div>

      <div className="!relative !bg-white/80 !backdrop-blur-xl !rounded-[32px] !shadow-[0_8px_32px_rgba(0,0,0,0.15)] !border !border-white/60 !p-8 !w-full !max-w-[420px] !transform !transition-all !overflow-hidden animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="!absolute !top-5 !right-5 !text-gray-400 hover:!text-gray-800 !transition-colors !bg-white/50 hover:!bg-white !rounded-full !p-2 !cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="!text-center !mb-8">
          <div className="!flex !justify-center !mb-1">
            <Image src="/landing/logo.png" width={100} height={100} alt="Japura Eats" className="!object-contain" />
          </div>
          
          <h2 className="!text-2xl !font-extrabold !text-gray-900 !tracking-tight">
            {view === 'login' && 'Welcome Back'}
            {view === 'register' && 'Create Account'}
            {view === 'forgotPassword' && 'Reset Password'}
          </h2>
          <p className="!text-sm !text-gray-500 !mt-1.5 !font-medium">
            {view === 'login' && 'Enter your details to access Japura Eats.'}
            {view === 'register' && 'Join us to start ordering your favorite food.'}
            {view === 'forgotPassword' && 'Enter your email to receive a reset link.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="!relative">
          {view === 'login' && <LoginForm setView={setView} onClose={onClose} setUser={setUser} />}
          {view === 'register' && <RegisterForm setView={setView} />}
          {view === 'forgotPassword' && <ForgotPasswordForm setView={setView} />}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(181, 34, 34, 0.2);
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default LoginModal;