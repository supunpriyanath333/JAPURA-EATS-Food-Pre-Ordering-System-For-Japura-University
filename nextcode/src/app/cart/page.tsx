"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "../components/CartContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function CartPage() {
  const router = useRouter();
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  // Group cart items by canteenId
  const groupedCart = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.canteenId]) {
        acc[item.canteenId] = {
          canteenName: item.canteenName,
          items: [],
          subtotal: 0
        };
      }
      acc[item.canteenId].items.push(item);
      acc[item.canteenId].subtotal += item.price * item.quantity;
      return acc;
    }, {} as Record<string, { canteenName: string; items: CartItem[]; subtotal: number }>);
  }, [cartItems]);

  const handleCheckout = (canteenId: string) => {
    // Navigate to checkout specifically for this canteen's items
    router.push(`/checkout?canteenId=${canteenId}`);
  };

  return (
    <div className={`min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden pb-20 ${inter.className}`}>

      {/* ── Decorative Background Orbs for Glass UI ── */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%', width: '35vw', height: '35vw',
        background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="container mx-auto px-4 max-w-4xl mt-12 relative z-10">

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-gray-900">
            Your Cart
          </h1>
          <p className="text-gray-500 font-medium text-base">Review your items and proceed to checkout.</p>
        </div>

        {Object.keys(groupedCart).length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any food yet.</p>
            <button
              onClick={() => router.push('/canteens')}
              className="px-8 py-3.5 bg-[#B52222] hover:bg-[#9c1d1d] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse Canteens
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(groupedCart).map(([canteenId, group]) => (
              <div
                key={canteenId}
                className="bg-white/70 backdrop-blur-xl border border-white rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 w-full"
              >
                <div className="px-6 py-6 md:px-10 md:py-8 w-                  {/* Canteen Header */}
                  <div className="flex items-center justify-between pb-3 mb-5">
                    <h2 className="text-[20px] md:text-[22px] font-extrabold text-gray-900 tracking-tight">
                      {group.canteenName}
                    </h2>
                    <span className="text-[#B52222] font-extrabold text-[15px]">
                      {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-col gap-4 mb-6">
                    {group.items.map((item) => (
                      <div key={item.id} className="group bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm flex flex-row items-stretch overflow-hidden">

                        {/* Image */}
                        <div className="w-[100px] sm:w-[110px] shrink-0 bg-gray-50 relative">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop"}
                            alt={item.name}
                            className="w-full h-full absolute inset-0 object-cover"
                          />
                          <div className="absolute inset-0 border-r border-white/50"></div>
                        </div>

                        {/* Content & Controls */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-row justify-between">
                          
                          {/* Middle: Details */}
                          <div className="flex flex-col justify-center">
                            <h3 className="font-extrabold text-gray-900 text-[16px] sm:text-[17px] leading-tight mb-1">{item.name}</h3>
                            {item.specialInstructions && (
                              <p className="text-[12px] text-gray-500 font-bold mb-1.5">
                                Instructions : {item.specialInstructions}
                              </p>
                            )}
                            <div className="text-gray-900 font-extrabold text-[14px] sm:text-[15px] mt-auto">
                              LKR. {item.price.toFixed(0)} &times; {item.quantity}
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-col items-end justify-between ml-3 shrink-0">
                            {/* Trash Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-7 h-7 bg-[#B52222] hover:bg-[#961b1b] text-white rounded-[6px] flex items-center justify-center transition-colors shadow-sm"
                              title="Remove Item"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>

                            {/* Quantity Control */}
                            <div className="flex items-center bg-white/70 border border-white/80 rounded-full px-2 py-0.5 shadow-sm mt-3">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                className="w-6 h-6 flex items-center justify-center text-gray-900 font-black text-[18px] hover:text-[#B52222] transition-colors"
                              >
                                &minus;
                              </button>
                              
                              <div className="w-6 sm:w-8 text-center font-extrabold text-gray-900 text-[14px]">
                                {item.quantity}
                              </div>
                              
                              <button
                                onClick={() => increaseQuantity(item.id)}
                                className="w-6 h-6 flex items-center justify-center text-gray-900 font-black text-[18px] hover:text-[#B52222] transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Subtotal and Checkout */}
                  <div className="flex items-end justify-between pt-6 mt-2 border-t border-white/40">
                    <div>
                      <div className="text-[13px] text-gray-600 font-extrabold uppercase tracking-wider mb-1">SUB TOTAL</div>
                      <div className="text-[24px] sm:text-[26px] font-extrabold text-gray-900 leading-none">LKR {group.subtotal.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => handleCheckout(canteenId)}
                      className="px-8 sm:px-10 py-3 sm:py-3.5 bg-[#A62B2B] hover:bg-[#8a1919] text-white font-bold rounded-[8px] transition-all text-[15px] sm:text-[16px] shadow-md hover:shadow-lg"
                    >
                      Checkout
                    </button>
                  </div>  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}