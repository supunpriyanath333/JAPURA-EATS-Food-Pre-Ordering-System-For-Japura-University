"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { useCart } from "./CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
}

export default function FoodCard({
  id,
  name,
  description,
  price,
  rating,
  image = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
  currency = "Rs.",
  onAddToCart,
  className = "",
  available,
  image_url,
}: FoodCardProps) {


  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!available) return;

    addToCart({ id, name, price, image, quantity: 1 });

    // Show popup
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // auto-hide after 2s
  };

  
  return (
    <div
      className={`
        flex gap-4 bg-white rounded-lg
        border border-gray-300
        transition-all duration-300 ease-out
        hover:shadow-md hover:border-gray-400
        ${className}
        ${inter.className}
      `}
      style={{ minWidth: "100%", minHeight: "150px", padding: "12px" }}
    >
      {/* Image */}
      <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ minWidth: "120px", minHeight: "120px", width: "120px", height: "120px" }}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header with Name and Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={`${inter.className} text-base font-bold text-black flex-1`}>
            {name}
          </h4>
          <div className="bg-white border border-gray-300 rounded-md inline-flex items-center gap-1 flex-shrink-0" style={{ minWidth: "60px", minHeight: "24px", padding: "4px 8px" }}>
            <svg
              className="w-4 h-4"
              fill="#FFD700"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-black font-semibold text-xs">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={`${inter.className} text-sm text-gray-500 mb-3 line-clamp-2 flex-1`}>
          {description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          <span className={`${inter.className} text-base font-bold text-black`}>
            {currency} {price.toFixed(0)}
          </span>
          <button
             onClick={handleAddToCart}
            className={`${inter.className} bg-[#B52222] text-white font-bold rounded-md text-sm hover:bg-[#9a1e1e] transition-all duration-200`}
            style={{ minWidth: "120px", minHeight: "36px", padding: "8px 16px" }}
          >
            Add To Cart
          </button>
        </div>
      </div>
      {/* Popup Notification */}
      {showPopup && (
        <div
          className="absolute bg-[#22c55e] text-white px-3 py-1 text-sm rounded shadow-lg z-50 animate-fadeInOut"
          // FIXED: Positioning the popup outside the top right corner relative to the card.
          style={{ 
                top: '-0.5rem', 
                right: '-0.5rem', 
                whiteSpace: 'nowrap' // Prevents unnecessary wrapping
            }} 
        >
          Item added successfully!
        </div>
      )}
    </div>
  );
}





