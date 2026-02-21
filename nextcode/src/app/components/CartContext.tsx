"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void; 
  decreaseQuantity: (id: string) => void; 
  clearCart: () => void;
  cartTotal: number; // ✨ NEW: Add cartTotal to the context type
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
