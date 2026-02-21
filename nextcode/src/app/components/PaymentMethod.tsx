"use client";
// src/app/checkout/components/PaymentMethod.tsx
import React, { useState } from 'react';

const PaymentMethod: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('Card Payment');
  const RED_COLOR = '#B52222';

  const MethodButton: React.FC<{ method: 'Card Payment' | 'Cash Payment' }> = ({ method }) => {
    const isActive = method === selectedMethod;

    return (
      <button
        onClick={() => setSelectedMethod(method)}
        className={`w-full text-base font-semibold rounded-lg shadow-sm transition-colors 
          ${isActive 
            ? 'text-white' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        style={{ 
          // Colors/Styles
          backgroundColor: isActive && method === 'Cash Payment' ? RED_COLOR : undefined,
          borderColor: isActive && method === 'Card Payment' ? RED_COLOR : undefined,
          color: isActive && method === 'Card Payment' ? RED_COLOR : (isActive ? 'white' : undefined),
          // Padding (py-3 px-6 equivalent)
          paddingTop: '0.75rem', 
          paddingBottom: '0.75rem', 
          paddingLeft: '1.5rem', 
          paddingRight: '1.5rem',
        }}
      >
        {method}
      </button>
    );
  };

  return (
    <div 
      className="bg-white shadow-md rounded-lg border border-gray-100"
      style={{ padding: '1.5rem' }} // p-6 equivalent
    >
      <h3 
        className="text-xl font-semibold text-gray-800 border-b" 
        style={{ marginBottom: '1rem', paddingBottom: '1rem' }} // mb-4 pb-4 equivalent
      >
        Select A Payment Method
      </h3>
      <h3 
        className="text-sm font-semibold text-red-600" 
        style={{ marginBottom: '1rem'}} // mb-4 pb-4 equivalent
      >
        Cards payments are not yet available. Coming soon.
      </h3>
      
      <div 
        className="flex max-w-lg" 
        style={{ gap: '1rem' }} // space-x-4 equivalent
      >
        <MethodButton method="Card Payment" />
        <MethodButton method="Cash Payment" />
      </div>
    </div>
  );
};

export default PaymentMethod;