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
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
      <h2 className={`${inter.className} text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight`}>
        {title}
      </h2>
      {linkText && (
        <a
          href={linkHref}
          className={`${inter.className} inline-flex items-center gap-1.5 text-sm md:text-base font-bold text-[#B52222] hover:text-[#8f1919] transition-colors`}
        >
          {linkText}
          <svg
            className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      )}
    </div>
  );
}



