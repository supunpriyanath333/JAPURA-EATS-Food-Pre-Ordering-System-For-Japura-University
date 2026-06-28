"use client";

// src/app/checkout/components/YourCart.tsx
import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CartItemCard from './CartItemCard';
import { useCart } from './CartContext';

const YourCart: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canteenId = searchParams.get('canteenId');
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  
  // Filter items for the current canteen checkout
  const checkoutItems = useMemo(() => {
    if (!canteenId) return cartItems; // fallback
    return cartItems.filter(item => item.canteenId === canteenId);
  }, [cartItems, canteenId]);

  // Extract canteen name from the first item
  const canteenName = checkoutItems.length > 0 ? checkoutItems[0].canteenName : "Unknown Canteen";

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full">
      <div className="!flex !flex-col sm:!flex-row sm:!items-center !justify-between !mb-5 !w-full border-b border-gray-300/50 !pb-4 !gap-2">
        <h3 className="text-xl font-extrabold text-gray-900 !m-0 !flex !items-center !flex-wrap !gap-1.5">
          Your Cart from 
          {canteenId ? (
            <span 
              onClick={() => router.push(`/canteen/${canteenId}`)}
              className="text-[#B52222] cursor-pointer hover:underline"
            >
              "{canteenName}"
            </span>
          ) : (
            <span className="text-[#B52222]">"{canteenName}"</span>
          )}
        </h3>
        <span className="text-[#B52222] font-bold text-[14px] shrink-0">
          {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>
      <div className="!flex !flex-col !gap-3 !w-full">
        {checkoutItems.map(item => (
          <CartItemCard 
            key={item.id} 
            item={item} 
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>
    </div>
  );
};

export default YourCart;