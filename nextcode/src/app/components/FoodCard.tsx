"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image?: string;
  currency?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
  available: boolean;
  image_url?: string;
  canteenId?: string;
  canteenName?: string;
}

export default function FoodCard({
  id,
  name,
  description,
  price,
  rating,
  image = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
  currency = "LKR",
  onAddToCart,
  className = "",
  available,
  image_url,
  canteenId,
  canteenName,
}: FoodCardProps) {
  const { addToCart, openFoodModal } = useCart();
  const [hovered, setHovered] = useState(false);
  const displayImage = image_url || image;

  const handleOpenModal = () => {
    if (!available) return;
    openFoodModal({ id, name, description, price, image: displayImage, currency, available, canteenId, canteenName });
  };

  return (
    <>
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popupFade {
          0%   { opacity: 0; transform: translateY(10px) scale(0.95); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          85%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .food-card { animation: cardFadeUp 0.45s ease both; }
        .food-card:hover .food-img { transform: scale(1.08); }
        .food-img { transition: transform 0.45s ease; }

        .glass-btn-cart {
          transition: all 0.2s ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-btn-cart:hover {
          background: #9a1e1e !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(181,34,34,0.35) !important;
        }
      `}</style>

      {/* ── Food Card ── */}
      <div
        className={`food-card relative flex gap-4 bg-white ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "20px",
          padding: "14px",
          minHeight: "150px",
          boxShadow: hovered
            ? "0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(181,34,34,0.06)"
            : "0 4px 16px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.04)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Image Section */}
        <div style={{
          position: "relative",
          width: "130px",
          height: "130px",
          borderRadius: "14px",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <img
            src={displayImage}
            alt={name}
            className="food-img w-full h-full object-cover block"
          />

        </div>

        {/* Content Section */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          minWidth: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
              <h4 style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#111",
                margin: 0,
                lineHeight: 1.2,
                fontFamily: "'Playfair Display', Georgia, serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1
              }}>
                {name}
              </h4>
              
              {/* Rating Badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "4px 8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                flexShrink: 0
              }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="#F7C948" style={{ display: "block" }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span style={{
                  color: "#374151",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                }}>
                  {rating ? rating.toFixed(1) : "—"}
                </span>
              </div>
            </div>
            
            <p style={{
              fontSize: "0.8rem",
              color: "#666",
              margin: 0,
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {description}
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
            gap: "10px"
          }}>
            <span style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#B52222",
              letterSpacing: "-0.02em"
            }}>
              {currency} {price.toFixed(0)}
            </span>

            <button
              onClick={handleOpenModal}
              className={available ? "glass-btn-cart" : ""}
              disabled={!available}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: available ? "#B52222" : "#9ca3af",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "8px 16px",
                cursor: available ? "pointer" : "not-allowed",
                boxShadow: available ? "0 4px 12px rgba(181,34,34,0.25)" : "none",
                opacity: available ? 1 : 0.5,
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
