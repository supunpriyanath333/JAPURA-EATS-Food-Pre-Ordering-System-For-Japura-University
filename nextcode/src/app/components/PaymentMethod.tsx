"use client";
// src/app/checkout/components/PaymentMethod.tsx
import React from 'react';
import { useCheckout } from './CheckoutContext';
import { CreditCard, Banknote } from 'lucide-react';

const PaymentMethod: React.FC = () => {
  const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckout();

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full">
      <h3 className="text-xl font-extrabold text-gray-900 border-b border-gray-300/50 !pb-4 !mb-5">
        Select A Payment Method
      </h3>
      
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
        {/* Card Payment (Disabled) */}
        <button
          disabled
          className="!w-full !p-4 !rounded-xl !border !text-left !transition-all !relative !overflow-hidden !flex !items-center !gap-3 !opacity-60 !cursor-not-allowed !bg-gray-200/50 !border-gray-300/50 !text-gray-400"
        >
          <div className="!p-2 !bg-gray-300/50 !rounded-lg !shrink-0">
            <CreditCard className="!w-6 !h-6 !text-gray-500" />
          </div>
          <div className="!flex !flex-col !flex-1">
            <span className="!font-bold !text-[14px] sm:!text-[15px] !tracking-tight">Card Payment</span>
            <span className="!text-[11px] !font-medium !text-gray-500">Coming soon...</span>
          </div>
        </button>

        {/* Cash Payment */}
        <button
          onClick={() => setSelectedPaymentMethod('cash')}
          className={`!w-full !p-4 !rounded-xl !border !text-left !transition-all !relative !overflow-hidden !flex !items-center !gap-3 !cursor-pointer
            ${selectedPaymentMethod === 'cash'
              ? '!bg-[#B52222] !border-[#B52222] !text-white !shadow-md !scale-[1.02]' 
              : '!bg-white/60 hover:!bg-white hover:!border-gray-300 !border-white/50 !text-gray-800 !shadow-sm'
            }`}
        >
          <div className={`!p-2 !rounded-lg !shrink-0 ${selectedPaymentMethod === 'cash' ? '!bg-white/20' : '!bg-[#B52222]/10'}`}>
            <Banknote className={`!w-6 !h-6 ${selectedPaymentMethod === 'cash' ? '!text-white' : '!text-[#B52222]'}`} />
          </div>
          <div className="!flex !flex-col !flex-1">
            <span className="!font-bold !text-[14px] sm:!text-[15px] !tracking-tight">Cash Payment</span>
            <span className={`!text-[11px] !font-medium ${selectedPaymentMethod === 'cash' ? '!text-white/80' : '!text-gray-500'}`}>
              Pay when you pick up
            </span>
          </div>
          
          {selectedPaymentMethod === 'cash' && (
            <div className="!absolute !top-1/2 !-translate-y-1/2 !right-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="!text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;