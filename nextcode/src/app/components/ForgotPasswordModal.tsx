"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl relative animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Forgot Password</h2>
          <Image
            src="/japura-eats-logo.png"
            alt="Logo"
            width={60}
            height={60}
          />
        </div>

        <p className="text-gray-600 mb-6">
          Reset Your Password for{" "}
          <span className="text-red-600 font-semibold">JAPURA EATS</span>
        </p>

        {/* Email Field */}
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none"
        />

        {/* Reset button */}
        <button className="w-full bg-red-700 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-red-800">
          RESET NOW
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Or{" "}
          <button
            onClick={onClose}
            className="font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
