"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title = "Welcome To JAPURA EATS",
  subtitle,
  description = "Pre-order your favorite meals from University Canteens and skip the queue.",
  primaryButtonText = "Get Start",
  primaryButtonHref = "canteens",
  secondaryButtonText = "About Us",
  secondaryButtonHref = "about",
  showSearch = true,
  searchPlaceholder = "Search Canteens Here",
  backgroundImage = "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&auto=format&fit=crop&q=80",
  className = "",
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canteens, setCanteens] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  // Fetch all canteens from API
  useEffect(() => {
    async function loadCanteens() {
      try {
        const res = await fetch("/api/canteens");
        const data = await res.json();
        setCanteens(data || []);
      } catch (err) {
        console.error("Failed to fetch canteens:", err);
      }
    }
    loadCanteens();
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = canteens.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
    setFiltered(matches);
  }, [query, canteens]);

  // Navigate to canteen page
  const handleCanteenSelect = (canteenId: string) => {
    router.push(`/canteen/${canteenId}`);
    setQuery("");
    setFiltered([]);
  };

  const tagline = "The Easier Way to Eat at Japura.";
  const descriptionText = description.includes(tagline)
    ? description.replace(tagline, "").trim()
    : description;

  return (
    <section
      className={`relative min-h-[400px] md:min-h-[450px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-[var(--color-black-original)]/30" />
      </div>

      {/* Logo */}
      <div className="absolute right-4 bottom-4 z-20">
        <Image src="/landing/logo.png" width={120} height={80} alt="JAPURA Eats Logo" className="opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center min-h-[400px] md:min-h-[450px]">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-white animate-fade-in font-bold">{title}</h1>

          {subtitle && <h2 className="text-xl md:text-2xl text-white font-semibold">{subtitle}</h2>}

          <p className="text-sm md:text-base text-white max-w-lg mx-auto leading-relaxed">{descriptionText}</p>
          <p className="text-sm md:text-base text-white italic">{tagline}</p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full" >
            <a
              href={primaryButtonHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B52222] text-white font-medium rounded-md text-base hover:bg-[#9a1e1e] transition-all duration-200"
              style={{paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingRight: "0.5rem", paddingLeft: "0.5rem"}}
            >
              {primaryButtonText}
            </a>

            <a
              href={secondaryButtonHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B52222] text-white font-medium rounded-md text-base hover:bg-[#9a1e1e] transition-all duration-200"
              style={{paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingRight: "0.5rem", paddingLeft: "0.5rem"}}
            >
              {secondaryButtonText}
            </a>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="relative w-full max-w-md mx-auto" >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-5 py-3 pr-12 bg-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                style={{paddingTop: "0.5rem", paddingBottom: "0.5rem"}}/>

              {/* Suggestions dropdown */}
              {filtered.length > 0 && (
                <div className="absolute left-0 right-0 bg-white rounded-md mt-1 shadow-lg z-20 max-h-48 overflow-y-auto">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleCanteenSelect(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
