"use client";

// src/app/checkout/components/YourCart.tsx
import React from 'react';
import CartItem from './CartItem';
import { useCart } from './CartContext';


const YourCart: React.FC = () => {

  const { cartItems } = useCart();
  
  return (
    <div 
      className="bg-white shadow-md rounded-lg border border-gray-100"
      style={{ padding: '1.5rem' }} // p-6 equivalent
    >
      <h3 
        className="text-xl font-semibold text-gray-800 border-b" 
        style={{ marginBottom: '1rem', paddingBottom: '1rem' }} // mb-4 pb-4 equivalent
      >
        Your Cart
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}> {/* space-y-4 equivalent gap */}
        {cartItems.map(item => (
          <CartItem imageSrc={item.image!} canteen={'Canteen Name'} key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default YourCart;