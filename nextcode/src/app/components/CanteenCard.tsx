"use client";

import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface CanteenCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  isOpen?: boolean;
  image?: string;
  onViewClick?: (id: string) => void;
  className?: string;
  phone: string;
  description: string;
  seller_email: string;
  imageUrl?: string; // optional
}

   // optional
export default function CanteenCard({
  id,
  name,
  location,
  rating,
  isOpen = true,
  onViewClick,
  className = "",
  description,
  phone,
  seller_email,
  imageUrl,
}: CanteenCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1
        flex flex-col
        ${className}
        ${inter.className}
      `}
      style={{ minWidth: "280px", minHeight: "400px" }}
    >
      {/* Image Container */}
      <div className="relative" style={{ minHeight: "200px" }}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          style={{ minHeight: "200px", height: "300px"}}
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white border border-black rounded-md inline-flex items-center gap-1" style={{ minWidth: "60px", minHeight: "28px", padding: "4px 8px" }}>
            <svg
              className="w-4 h-4"
              fill="#FFD700"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-black font-semibold text-sm">
              {1}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1" style={{ minHeight: "200px", padding: "16px" }}>
        {/* Name */}
        <h3 className={`${inter.className} text-lg font-bold text-black mb-2`} style={{ minHeight: "28px" }}>
          {name}
        </h3>

        {/* Location */}
        <div className={`${inter.className} flex items-center gap-2 text-sm text-gray-500 mb-2`} style={{ minHeight: "24px" }}>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{location}</span>
        </div>

        {/* Status */}
        <div className={`${inter.className} flex items-center gap-2 text-sm mb-4`} style={{ minHeight: "24px" }}>
          <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={isOpen ? "text-[#22c55e] font-medium" : "text-red-500 font-medium"}>
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewClick?.(id)}
          className={`${inter.className} bg-[#B52222] text-white font-medium rounded-md text-sm hover:bg-[#9a1e1e] transition-all duration-200 mt-auto`}
          style={{ minWidth: "100%", minHeight: "40px", padding: "10px 16px" }}
        >
          View Now
        </button>
      </div>
    </div>
  );
}





