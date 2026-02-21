"use client";

import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
  className?: string;
  foodImages?: string[];
}

export default function PromoBanner({
  title = "Up to 10% off — Today Only",
  subtitle = "Selected items. Prices drop automatically at checkout.",
  description = "order above Rs.1000.00 From Canteen 002",
  buttonText = "View Now",
  buttonHref = "#",
  backgroundImage,
  foodImages = [
    "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&auto=format&fit=crop&q=80",
  ],
  className = "",
}: PromoBannerProps) {
  return (
    <section className={`container mx-auto px-4 py-8 flex items-center justify-center ${className}`}>
  <div
  className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${inter.className} bg-[#A88920] flex items-center justify-center`}
  style={{ minHeight: "280px" }}
>
  <div className="flex flex-col md:flex-row items-center justify-center h-full gap-6 md:gap-8 p-6 md:p-10">


          {/* Content Section */}
          <div className="flex-1 text-center z-10 flex flex-col gap-3">

            {/* Title */}
            <h3 className={`${inter.className} text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight`}>
              {title.includes("—") ? (
                <>
                  {title.split("—")[0]}— <span className="underline decoration-2">Today Only</span>
                </>
              ) : (
                title
              )}
            </h3>

            {/* Subtitle */}
            <p className={`${inter.className} text-sm md:text-base text-white/95 mb-2 font-medium`}>
              {subtitle}
            </p>

            {/* Description */}
            <p className={`${inter.className} text-xs md:text-sm text-white/90 mb-6`}>
              {description}
            </p>

            {/* Button */}
            <a
              href={buttonHref}
              className={`${inter.className} inline-flex items-center justify-center bg-[#B52222] text-white font-bold rounded-lg hover:bg-[#9a1e1e] transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base`}
              style={{ minWidth: "140px", minHeight: "44px", padding: "10px 24px" }}
            >
              {buttonText}
            </a>
          </div>

          {/* Food Images Section */}
          <div className="flex items-center justify-center gap-4 md:gap-6 z-10">
            {foodImages.map((img, index) => (
              <div
                key={index}
                className="rounded-full overflow-hidden border-4 border-white shadow-xl"
                style={{
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={img}
                  alt={`Food ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



