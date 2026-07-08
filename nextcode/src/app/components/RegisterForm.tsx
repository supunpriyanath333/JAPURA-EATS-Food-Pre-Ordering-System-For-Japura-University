// src/app/components/RegisterForm.tsx
"use client";

import React, { useState } from 'react';

interface RegisterFormProps {
  setView: (view: 'login' | 'register' | 'forgotPassword') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ setView }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'lecturer' | 'staff'>('student');

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const role = selectedRole;
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const roleSpecificData: any = {};
    if (selectedRole === 'student') {
      roleSpecificData.student_reg_no = formData.get("student_reg_no") as string;
      roleSpecificData.faculty = formData.get("faculty") as string;
    } else if (selectedRole === 'lecturer') {
      roleSpecificData.lecture_id = formData.get("lecture_id") as string;
      roleSpecificData.faculty = formData.get("faculty") as string;
    } else if (selectedRole === 'staff') {
      roleSpecificData.staff_id = formData.get("staff_id") as string;
      roleSpecificData.position = formData.get("position") as string;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, full_name, email, mobile, password, ...roleSpecificData }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }
      alert("Registration successful! Please login.");
      setView("login");
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
    <div className="animate-fade-in !max-h-[60vh] !overflow-y-auto !pr-2 custom-scrollbar">
      <form onSubmit={handleRegisterSubmit} className="!flex !flex-col !gap-4">

        <div className="!bg-white/50 !p-1.5 !rounded-xl !border !border-white/60 !flex !items-center !shadow-sm">
          {(["student", "lecturer", "staff"] as const).map((roleOption) => (
            <label key={roleOption} className="!flex-1 !cursor-pointer">
              <div className="!flex !items-center !justify-center !gap-2 !py-2 !rounded-lg !transition-all hover:!bg-white/50">
                <input
                  type="radio"
                  name="role"
                  value={roleOption}
                  checked={selectedRole === roleOption}
                  onChange={() => setSelectedRole(roleOption)}
                  className="!w-4 !h-4 !accent-[#B52222] !cursor-pointer"
                />
                <span className="!text-sm !font-semibold !text-gray-700 !capitalize">
                  {roleOption}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div>
          <label className={labelStyles}>Full Name</label>
          <input type="text" name="full_name" placeholder="Nimal Perera" required className={inputStyles} />
        </div>

        {/* Dynamic Fields based on Role */}
        {selectedRole === 'student' && (
          <>
            <div>
              <label className={labelStyles}>Student Reg No</label>
              <input type="text" name="student_reg_no" placeholder="e.g. AR12345" required className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Faculty</label>
              <input type="text" name="faculty" placeholder="e.g. Faculty of Applied Sciences" required className={inputStyles} />
            </div>
          </>
        )}

        {selectedRole === 'lecturer' && (
          <>
            <div>
              <label className={labelStyles}>Lecture ID</label>
              <input type="text" name="lecture_id" placeholder="e.g. LEC1234" required className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Faculty</label>
              <input type="text" name="faculty" placeholder="e.g. Faculty of Management" required className={inputStyles} />
            </div>
          </>
        )}

        {selectedRole === 'staff' && (
          <>
            <div>
              <label className={labelStyles}>Staff ID</label>
              <input type="text" name="staff_id" placeholder="e.g. STF5678" required className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Position</label>
              <input type="text" name="position" placeholder="e.g. Assistant Registrar" required className={inputStyles} />
            </div>
          </>
        )}

        <div>
          <label className={labelStyles}>Email Address</label>
          <input type="email" name="email" placeholder="Mail@example.com" required className={inputStyles} />
        </div>

        <div>
          <label className={labelStyles}>Mobile Number</label>
          <input type="tel" name="mobile" placeholder="07XXXXXXXX" required className={inputStyles} />
        </div>

        <div>
          <label className={labelStyles}>Password</label>
          <input type="password" name="password" placeholder="••••••••" required className={inputStyles} />
        </div>

        <div>
          <label className={labelStyles}>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="••••••••" required className={inputStyles} />
        </div>

        <button type="submit" disabled={loading} className={`${btnStyles} !mt-2`}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="!text-center !mt-6 !mb-2">
        <span className="!text-sm !text-gray-500 !font-medium">Already have an account? </span>
        <button type="button" onClick={() => setView('login')} className="!text-sm !font-bold !text-[#B52222] hover:!underline !cursor-pointer">
          Sign in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;