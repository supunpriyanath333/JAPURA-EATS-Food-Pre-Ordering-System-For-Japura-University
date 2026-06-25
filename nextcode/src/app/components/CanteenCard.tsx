"use client";

import React, { useState } from "react";

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
  imageUrl?: string;
}

export default function CanteenCard({
  id,
  name,
  location,
  rating,
  isOpen = true,
  onViewClick,
  className = "",
  phone,
  imageUrl,
}: CanteenCardProps) {
  const [hovered, setHovered] = useState(false);
  const [favourite, setFavourite] = useState(false);

  return (
    <>
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .canteen-card { animation: cardFadeUp 0.45s ease both; }
        .canteen-card:hover .card-img { transform: scale(1.06); }
        .card-img { transition: transform 0.45s ease; }

        .glass-btn-primary {
          transition: all 0.2s ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-btn-primary:hover {
          background: #9a1e1e !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(181,34,34,0.42) !important;
        }
        .fav-btn {
          transition: all 0.2s ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .fav-btn:hover { transform: translateY(-2px); }
        .fav-btn.active .fav-icon { animation: heartPop 0.35s ease; }
      `}</style>

      <div
        className={`canteen-card ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: "white",
          boxShadow: hovered
            ? "0 24px 60px rgba(0,0,0,0.14), 0 8px 24px rgba(181,34,34,0.08)"
            : "0 4px 24px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Image Section ── */}
        <div style={{ position: "relative", height: "190px", overflow: "hidden", flexShrink: 0 }}>
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"}
            alt={name}
            className="card-img"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }} />

          {/* ── Rating Badge ── */}
          <div style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "9999px",
            padding: "5px 10px",
            height: "28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}>
            <svg
              width="12" height="12"
              viewBox="0 0 20 20"
              fill="#FFD700"
              style={{ display: "block", flexShrink: 0 }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span style={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.76rem",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}>
              {rating ?? "—"}
            </span>
          </div>

          {/* ── Open/Closed pill ── */}
          <div style={{
            position: "absolute", bottom: "12px", left: "12px",
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: isOpen ? "rgba(34,197,94,0.22)" : "rgba(239,68,68,0.22)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: `1px solid ${isOpen ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)"}`,
            borderRadius: "9999px",
            padding: "4px 12px",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: isOpen ? "#22c55e" : "#ef4444",
              display: "inline-block",
              boxShadow: isOpen ? "0 0 0 2px rgba(34,197,94,0.35)" : "0 0 0 2px rgba(239,68,68,0.35)",
            }} />
            <span style={{ color: "white", fontWeight: 600, fontSize: "0.73rem" }}>
              {isOpen ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>

        {/* ── Content Section ── */}
        <div style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "10px",
        }}>
          {/* Name */}
          <h3 style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: "#111",
            margin: 0,
            lineHeight: 1.25,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            {name}
          </h3>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B52222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: "0.78rem", color: "#666", fontWeight: 500 }}>{location}</span>
          </div>



          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "2px 0" }} />

          {/* ── Action Buttons ── */}
          <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>

            {/* View Menu */}
            <button
              className="glass-btn-primary"
              onClick={() => onViewClick?.(id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                padding: "10px 0",
                background: "#B52222",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontWeight: 700,
                fontSize: "0.83rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(181,34,34,0.28)",
                letterSpacing: "0.01em",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              View Menu
            </button>

            {/* Favourite Toggle */}
            <button
              className={`fav-btn ${favourite ? "active" : ""}`}
              onClick={() => setFavourite((f) => !f)}
              title={favourite ? "Remove from Favourites" : "Add to Favourites"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 13px",
                background: favourite ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.04)",
                border: `1.5px solid ${favourite ? "rgba(239,68,68,0.35)" : "rgba(0,0,0,0.1)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              aria-label={favourite ? "Remove from Favourites" : "Add to Favourites"}
            >
              <svg
                className="fav-icon"
                width="17" height="17"
                viewBox="0 0 24 24"
                fill={favourite ? "#ef4444" : "none"}
                stroke={favourite ? "#ef4444" : "#aaa"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
