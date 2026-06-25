"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  primaryButtonText = "Order Now",
  primaryButtonHref = "canteens",
  secondaryButtonText = "About Us",
  secondaryButtonHref = "about",
  showSearch = true,
  searchPlaceholder = "Search canteens or food...",
  backgroundImage = "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1400&auto=format&fit=crop&q=85",
  className = "",
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canteens, setCanteens] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
    if (!query.trim()) { setFiltered([]); return; }
    const q = query.toLowerCase();
    setFiltered(canteens.filter((c) => c.name.toLowerCase().includes(q)));
  }, [query, canteens]);

  const handleCanteenSelect = (canteenId: string) => {
    router.push(`/canteen/${canteenId}`);
    setQuery("");
    setFiltered([]);
  };

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(181,34,34,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(181,34,34,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .hero-fade-up-1 { animation: heroFadeUp 0.7s ease both 0.1s; opacity: 0; }
        .hero-fade-up-2 { animation: heroFadeUp 0.7s ease both 0.28s; opacity: 0; }
        .hero-fade-up-3 { animation: heroFadeUp 0.7s ease both 0.44s; opacity: 0; }
        .hero-fade-up-4 { animation: heroFadeUp 0.7s ease both 0.60s; opacity: 0; }
        .hero-fade-up-5 { animation: heroFadeUp 0.7s ease both 0.76s; opacity: 0; }
        .hero-btn-primary:hover { background: #9a1e1e !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(181,34,34,0.4) !important; }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-2px); }
        .hero-btn-primary, .hero-btn-secondary { transition: all 0.22s ease; }
        .stat-chip:hover { transform: translateY(-2px); }
        .stat-chip { transition: transform 0.2s ease; }
      `}</style>

      <section
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{ minHeight: "680px" }}
      >
        {/* ── Background image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})`, transform: "scale(1.03)" }}
        />

        {/* ── Multi-layer cinematic gradient overlay ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(10,5,5,0.62) 50%, rgba(10,5,5,0.82) 100%)",
          }}
        />
        {/* Subtle maroon tint from bottom-left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(181,34,34,0.22) 0%, transparent 60%)",
          }}
        />

        {/* ── Logo watermark ── */}
        <div className="absolute right-5 bottom-5 z-20 opacity-70">
          <Image src="/landing/logo.png" width={100} height={68} alt="JAPURA Eats Logo" />
        </div>

        {/* ── Main Content ── */}
        <div
          className="relative z-10 container mx-auto px-4 flex items-center justify-center"
          style={{ minHeight: "680px", paddingTop: "90px", paddingBottom: "80px" }}
        >
          <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center gap-6">



            {/* Title */}
            <div className="hero-fade-up-1">
              <h1 style={{
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "white",
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: "0 2px 24px rgba(0,0,0,0.35)",
              }}>
                The Smarter Way to{" "}
                <span style={{
                  backgroundImage: "linear-gradient(135deg, #ffffff 0%, #ffcf7d 40%, #ff8c42 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(255,160,60,0.55))",
                }}>
                  Eat at Japura
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="hero-fade-up-3">
              <p style={{
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                color: "rgba(255,255,255,0.75)",
                maxWidth: "520px",
                lineHeight: 1.7,
                margin: "0 auto",
              }}>
                Pre-order your favourite meals from university canteens, skip the queue,
                and enjoy hot food — ready exactly when you are.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-fade-up-4" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href={primaryButtonHref}
                className="hero-btn-primary"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "0.72rem 1.8rem",
                  background: "#B52222",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 18px rgba(181,34,34,0.38)",
                  letterSpacing: "0.01em",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                {primaryButtonText}
              </a>

              <a
                href={secondaryButtonHref}
                className="hero-btn-secondary"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "0.72rem 1.8rem",
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                {secondaryButtonText}
              </a>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="hero-fade-up-5 relative w-full" style={{ maxWidth: "580px" }}>
                {/* Input wrapper */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    borderRadius: "9999px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 6px 5px 20px",
                    gap: "10px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,170,50,0.7)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(255,170,50,0.15), 0 8px 32px rgba(0,0,0,0.2)";
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.3)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)";
                  }}
                >
                  {/* Search icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filtered.length > 0) handleCanteenSelect(filtered[0].id);
                    }}
                    placeholder={searchPlaceholder}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: "0.9rem",
                      padding: "0.6rem 0",
                      fontFamily: "inherit",
                    }}
                    className="placeholder-white/50"
                  />

                  {/* Clear */}
                  {query && (
                    <button
                      onClick={() => { setQuery(""); setFiltered([]); }}
                      style={{
                        background: "rgba(255,255,255,0.18)",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px", height: "24px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "12px",
                        flexShrink: 0,
                        transition: "background 0.15s",
                      }}
                      aria-label="Clear"
                    >✕</button>
                  )}

                  {/* Search button */}
                  <button
                    onClick={() => filtered.length > 0 && handleCanteenSelect(filtered[0].id)}
                    className="hero-btn-primary"
                    style={{
                      background: "#B52222",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "0.55rem 1.3rem",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      flexShrink: 0,
                      letterSpacing: "0.02em",
                      boxShadow: "0 4px 14px rgba(181,34,34,0.4)",
                    }}
                  >
                    Search
                  </button>
                </div>

                {/* Dropdown */}
                {filtered.length > 0 && (
                  <div style={{
                    position: "absolute",
                    left: 0, right: 0,
                    marginTop: "10px",
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "18px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    zIndex: 50,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.07)",
                  }}>
                    {filtered.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => handleCanteenSelect(c.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "13px 20px",
                          background: "transparent",
                          border: "none",
                          borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{
                          width: "38px", height: "38px",
                          background: "linear-gradient(135deg,rgba(181,34,34,0.12),rgba(181,34,34,0.06))",
                          borderRadius: "12px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B52222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/>
                            <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
                          </svg>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.87rem", color: "#111" }}>{c.name}</span>
                          {c.location && (
                            <span style={{ fontSize: "0.73rem", color: "#999", display: "flex", alignItems: "center", gap: "3px" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {c.location}
                            </span>
                          )}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto", flexShrink: 0 }}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats row */}
            <div
              className="hero-fade-up-5"
              style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px", paddingBottom: "16px", position: "relative", zIndex: 20 }}
            >
              {[
                { icon: "🏪", value: "3+", label: "Canteens" },
                { icon: "🍛", value: "50+", label: "Menu Items" },
                { icon: "⚡", value: "Fast", label: "Pre-order" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-chip"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "9999px",
                    padding: "7px 16px",
                    cursor: "default",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{stat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.84rem", color: "white" }}>{stat.value}</span>
                  <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.7)" }}>{stat.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom fade-to-page — sits below z-10 content */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "72px",
            background: "linear-gradient(to bottom, transparent 0%, var(--bg-primary, #ffffff) 100%)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      </section>
    </>
  );
}
