"use client";

// src/app/checkout/components/YourCart.tsx
import React from 'react';
import CartItem from './CartItem';
import { useCart } from './CartContext';


const YourCart: React.FC = () => {

  const { cartItems } = useCart();
  
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full">
      <div className="!flex !items-center !justify-between !mb-5 !w-full border-b border-gray-300/50 !pb-4">
        <h3 className="text-xl font-extrabold text-gray-900 !m-0">
          Your Cart
        </h3>
        <span className="text-[#B52222] font-bold text-[14px]">
          {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>
      <div className="!flex !flex-col !gap-3 !w-full">
        {cartItems.map(item => (
          <CartItem imageSrc={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop"} canteen={item.canteenName || 'Canteen Name'} key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default YourCart;