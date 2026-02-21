"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CheckoutContextType {
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  selectedPaymentMethod: 'card' | 'cash';
  setSelectedPaymentMethod: (method: 'card' | 'cash') => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('07.45 AM - 08.00 AM');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash'>('cash');

  return (
    <CheckoutContext.Provider value={{ 
      selectedTimeSlot, 
      setSelectedTimeSlot, 
      selectedPaymentMethod, 
      setSelectedPaymentMethod 
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
  return context;
};