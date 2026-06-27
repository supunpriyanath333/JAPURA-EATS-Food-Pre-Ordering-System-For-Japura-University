"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
  canteenId: string; // ✨ NEW: to group carts
  canteenName: string; // ✨ NEW: to group carts
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void; 
  decreaseQuantity: (id: string) => void; 
  clearCart: () => void;
  cartTotal: number;
  
  selectedFoodForModal: FoodCardProps | null;
  openFoodModal: (food: FoodCardProps) => void;
  closeFoodModal: () => void;
}

export interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  currency?: string;
  available?: boolean;
  canteenId?: string; // ✨ NEW
  canteenName?: string; // ✨ NEW
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodCardProps | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Function to find and update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
    const newItems = prev
    .map((i) =>
    i.id === id ? { ...i, quantity: i.quantity + delta } : i
    )
    .filter((i) => i.quantity > 0); // Remove item if quantity hits 0
    
    return newItems;
    });
    };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Create a unique ID for the cart item based on original ID + special instructions
      const uniqueId = item.specialInstructions 
        ? `${item.id}-${item.specialInstructions}`
        : item.id;
        
      const existing = prev.find((i) => i.id === uniqueId);
      if (existing) {
        return prev.map((i) =>
          i.id === uniqueId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, { ...item, id: uniqueId, quantity: item.quantity }];
      }
    });
    showToast(`Added ${item.name} to cart!`);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // ✨ NEW: Increase quantity
  const increaseQuantity = (id: string) => updateQuantity(id, 1);
  
  // ✨ NEW: Decrease quantity (will remove if quantity becomes 0)
  const decreaseQuantity = (id: string) => updateQuantity(id, -1);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart,
        cartTotal, // ✨ NEW: Include cartTotal in the context value
        increaseQuantity,
        decreaseQuantity,
        selectedFoodForModal,
        openFoodModal: setSelectedFoodForModal,
        closeFoodModal: () => setSelectedFoodForModal(null),
      }}
    >
      {children}
      
      {/* Global Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "85px",
          right: "24px",
          background: "#22c55e",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(34,197,94,0.4)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 600,
          animation: "toastFadeDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {toastMessage}
          <style>{`
            @keyframes toastFadeDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </CartContext.Provider>
  );
};
