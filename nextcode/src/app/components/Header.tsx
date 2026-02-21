"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface HeaderProps {
  user: any,
  setUser: any,
  navItems?: NavItem[];
  className?: string;
  cartNotificationActive?: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const defaultNavItems: NavItem[] = [
  {
    label: "HOME",
    href: "/",
    isActive: true,
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    label: "CANTEENS",
    href: "/canteens",
    icon: (
      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "ORDERS",
    href: "/orders",
    icon: (
      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];


export default function Header({user,
  setUser,
  navItems = defaultNavItems,
  className = "",
  cartNotificationActive = false,
  isModalOpen,
  setIsModalOpen}: HeaderProps) {

  
    const pathname = usePathname(); 
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("supabase_session");
    setUser(null);
    setIsModalOpen(true);
  };


  return (
    <>
      <header className={`bg-[rgb(var(--color-hero-bg))]/[0.69] sticky top-0 z-50 shadow-sm ${className}`}>
        <div className="container mx-auto px-4 flex items-center justify-between" style={{ height: '81px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/landing/logo.png" width={70} height={50} alt="Logo" />
            <div className="hidden md:block">
              <h1 className="text-2xl font-extrabold text-[#B52222]">JAPURA EATS</h1>
              <p className="text-xs italic text-gray-600">The Easier Way to Eat at Japura.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return <Link
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-[#B52222] font-bold text-white" : "text-black font-bold hover:bg-gray-200"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
  })}
          </nav>

          {/* Profile / Login */}
          <div className="flex items-center gap-3">
            {/* Notification Button (always visible) */}
            <Link href={""}><button className="p-2 rounded-full hover:bg-gray-200 transition-colors relative">
              <svg
                className="w-6 h-6 text-[#B52222]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button></Link>

            {/* Checkout Button (always visible, navigates to /checkout) */}
            <Link href="/checkout">
              <button className="p-2 rounded-full hover:bg-gray-200 transition-colors relative">
                <svg
                  className="w-6 h-6 text-[#B52222]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </Link>

            {/* Login / Logout Button */}
            {user ? (
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  className="w-6 h-6 text-[#B52222]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}
          </div>

        </div>
      </header>
    </>
  );
}