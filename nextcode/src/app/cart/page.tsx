"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "../components/CartContext";
import CartItemCard from "../components/CartItemCard";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function CartPage() {
  const router = useRouter();
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const groupedCart = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.canteenId]) {
        acc[item.canteenId] = {
          canteenName: item.canteenName,
          items: [],
          subtotal: 0,
        };
      }
      acc[item.canteenId].items.push(item);
      acc[item.canteenId].subtotal += item.price * item.quantity;
      return acc;
    }, {} as Record<string, { canteenName: string; items: CartItem[]; subtotal: number }>);
  }, [cartItems]);

  const handleCheckout = (canteenId: string) => {
    router.push(`/checkout?canteenId=${canteenId}`);
  };

  return (
    <div className={`min-h-screen bg-transparent relative !pb-24 !w-full !flex !flex-col overflow-x-hidden ${inter.className}`}>

      {/* Background Orbs */}
      <div className="fixed top-[-5%] left-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(181,34,34,0.22)_0%,rgba(255,255,255,0)_70%)] blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(245,158,11,0.18)_0%,rgba(255,255,255,0)_70%)] blur-[110px] -z-10 pointer-events-none" />
      <div className="fixed top-[35%] right-[20%] w-[35vw] h-[35vw] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_75%)] blur-[120px] -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto !pt-12">

        <div className="!mb-8 text-center !w-full">
          <h1 className="text-4xl font-extrabold tracking-tight !mb-2 text-gray-900">Your Cart</h1>
          <p className="text-gray-500 font-medium text-sm !m-0">Review your items and proceed to checkout.</p>
        </div>

        {Object.keys(groupedCart).length === 0 ? (
          <div className="!flex !flex-col !items-center !justify-center text-center !py-20 !px-4 bg-white/45 backdrop-blur-[28px] border border-white/80 rounded-[28px] shadow-lg !w-full">
            <div className="!w-24 !h-24 bg-red-50 text-red-500 rounded-full !flex !items-center !justify-center !mb-6 shadow-sm shrink-0">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 !mb-3 !mt-0">Your cart is empty</h2>
            <p className="text-gray-500 !mb-8 !mt-0">Looks like you haven't added any food yet.</p>
            <button
              onClick={() => router.push("/canteens")}
              className="!px-8 !py-3.5 bg-[#B52222] hover:bg-[#9c1d1d] text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer border-none"
            >
              Browse Canteens
            </button>
          </div>
        ) : (
          <div className="!flex !flex-col !gap-8 !w-full">
            {Object.entries(groupedCart).map(([canteenId, group]) => (
              <div
                key={canteenId}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !w-full !p-5 sm:!p-6 !flex !flex-col"
              >

                {/* Canteen Header */}
                <div className="!flex !items-center !justify-between !mb-5 !w-full border-b border-white/50 !pb-4">
                  <div
                    onClick={() => router.push(`/canteen/${canteenId}`)}
                    className="!flex !items-center !gap-2 !cursor-pointer group"
                  >
                    <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-[#B52222] transition-colors !m-0">
                      {group.canteenName}
                    </h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#B52222] group-hover:translate-x-1 transition-all">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                  <span className="text-[#B52222] font-bold text-[14px]">
                    {group.items.length} {group.items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items */}
                <div className="!flex !flex-col !gap-3 !mb-6 !w-full">
                  {group.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onIncrease={increaseQuantity}
                      onDecrease={decreaseQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="!flex !flex-row !items-end !justify-between !pt-5 border-t border-white/50 !w-full !gap-4">
                  <div className="!flex !flex-col">
                    <span className="text-[12px] text-gray-500 font-bold uppercase tracking-widest !mb-1">SUB TOTAL</span>
                    <span className="text-[24px] font-extrabold text-gray-900 leading-none !m-0">LKR {group.subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleCheckout(canteenId)}
                    className="group !px-8 !py-3.5 bg-gradient-to-r from-[#B52222] to-[#d43131] hover:from-[#9c1d1d] hover:to-[#B52222] text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-[0_8px_20px_rgba(181,34,34,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap border-none !flex !items-center !justify-center !gap-2"
                  >
                    <span>Checkout</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}