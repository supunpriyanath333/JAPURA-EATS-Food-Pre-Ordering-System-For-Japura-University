"use client";

import React, { useState } from "react";
import { CartItem } from "./CartContext";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      setShowConfirm(true);
    } else {
      onDecrease(item.id);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-white/50 shadow-sm !flex !flex-row !items-stretch !p-3 !gap-4 !w-full relative transition-all hover:bg-white/40">

      {/* Image */}
      <div className="!w-[75px] !h-[75px] rounded-xl overflow-hidden shrink-0 bg-white/40">
        <img
          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop"}
          alt={item.name}
          className="!w-full !h-full object-cover"
        />
      </div>

      {/* Text Details */}
      <div className="!flex-1 !flex !flex-col !justify-center min-w-0">
        <h3 className="font-bold text-gray-900 text-[16px] truncate !m-0">{item.name}</h3>
        {item.specialInstructions && (
          <p className="text-[12px] text-gray-600 font-medium !mt-0.5 !mb-0 line-clamp-2">
            Instructions : {item.specialInstructions}
          </p>
        )}
        <p className="text-gray-900 font-extrabold text-[14px] !mt-1 !mb-0">
          LKR. {item.price.toFixed(0)} &times; {item.quantity}
        </p>
      </div>

      {/* Controls */}
      <div className="!flex !flex-col !items-end !justify-between shrink-0 relative z-10">
        <button
          onClick={() => setShowConfirm(true)}
          className="!w-8 !h-8 !flex !items-center !justify-center text-[#B52222] hover:bg-red-100/50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

        <div className="!flex !items-center bg-white/70 backdrop-blur-md border border-white/60 rounded-full !px-2 !py-1 shadow-sm !gap-3 !mt-2">
          <button onClick={handleDecrease} className="text-gray-700 hover:text-[#B52222] font-bold !px-1 cursor-pointer border-none bg-transparent">&minus;</button>
          <span className="font-bold text-[13px] text-gray-900 !w-4 text-center select-none !m-0">{item.quantity}</span>
          <button onClick={() => onIncrease(item.id)} className="text-gray-700 hover:text-[#B52222] font-bold !px-1 cursor-pointer border-none bg-transparent">+</button>
        </div>
      </div>

      {/* Confirmation Overlay within the Card */}
      <div
        className={`!absolute !inset-0 !z-20 !rounded-2xl !flex !items-center !justify-between !px-3 sm:!px-5 !transition-all !duration-300 ${showConfirm
          ? "!opacity-100 !pointer-events-auto !bg-white/90 !backdrop-blur-xl !border !border-red-200 !shadow-[0_8px_30px_rgb(181,34,34,0.15)]"
          : "!opacity-0 !pointer-events-none"
          }`}
      >
        <div className="!flex !items-center !gap-3">
          <div className="!w-10 !h-10 !bg-red-100 !text-red-500 !rounded-full !flex !items-center !justify-center !shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </div>
          <div className="!flex !flex-col">
            <span className="!font-extrabold !text-gray-900 !text-[15px] !m-0 !leading-tight">Remove Item?</span>
            <span className="!text-[12px] !text-gray-500 !font-medium hidden sm:!block !m-0">This action cannot be undone.</span>
          </div>
        </div>

        <div className="!flex !items-center !gap-2.5">
          <button
            onClick={() => setShowConfirm(false)}
            className="!px-4 !py-2 !rounded-xl !text-gray-700 !font-bold !text-[13px] !bg-white/60 hover:!bg-white/90 !border !border-gray-300/50 !shadow-sm hover:!shadow-md !transition-all hover:!-translate-y-0.5 active:!scale-95 !cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="!px-4 !py-2 !rounded-xl !bg-gradient-to-r !from-[#B52222] !to-[#d43131] hover:!from-[#9c1d1d] hover:!to-[#B52222] !text-white !font-bold !text-[13px] !shadow-md hover:!shadow-[0_6px_15px_rgba(181,34,34,0.35)] !transition-all hover:!-translate-y-0.5 active:!scale-95 !cursor-pointer !border-none"
          >
            Remove
          </button>
        </div>
      </div>

    </div>
  );
}