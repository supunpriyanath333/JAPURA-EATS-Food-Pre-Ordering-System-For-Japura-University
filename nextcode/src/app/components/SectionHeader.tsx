"use client";

import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  linkText,
  linkHref = "#",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className=""><div className={`flex items-center justify-between ${className} ${inter.className}`}>
    <h2 className={`${inter.className} text-2xl md:text-3xl font-bold text-black `}>
      {title}
    </h2>
    {linkText && (
      <a
        href={linkHref}
        className={`${inter.className} inline-flex items-center gap-1 text-base font-medium text-black hover:opacity-70 transition-opacity duration-200`}
      >
        {linkText}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    )}
  </div></div>
  );
}



