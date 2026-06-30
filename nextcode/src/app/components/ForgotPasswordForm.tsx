// src/app/components/ForgotPasswordForm.tsx
"use client";

import React from 'react';

interface ForgotPasswordFormProps {
  setView: (view: 'login' | 'register' | 'forgotPassword') => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ setView }) => {
  const inputStyles = "!w-full !px-4 !py-3 !bg-white/70 !border !border-white/60 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white focus:!border-transparent !transition-all !text-gray-800 !placeholder-gray-400 !font-medium";
  const labelStyles = "!block !text-sm !font-semibold !text-gray-700 !mb-1.5 !ml-1";
  const btnStyles = "!w-full !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !py-3.5 !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 active:!scale-[0.98] !transition-all !flex !justify-center !items-center !cursor-pointer";

  return (
    <div className="animate-fade-in">
      <form className="!flex !flex-col !gap-4" onSubmit={(e) => { e.preventDefault(); alert("Reset link sent!"); setView('login'); }}>
        <div>
          <label className={labelStyles}>Email Address</label>
          <input type="email" placeholder="Enter your registered email" required className={inputStyles} />
        </div>

        <button type="submit" className={`${btnStyles} !mt-2`}>
          Send Reset Link
        </button>
      </form>

      <div className="!text-center !mt-6">
        <button type="button" onClick={() => setView('login')} className="!text-sm !font-bold !text-gray-600 hover:!text-gray-900 !flex !items-center !justify-center !gap-1 !w-full !transition-colors !cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
