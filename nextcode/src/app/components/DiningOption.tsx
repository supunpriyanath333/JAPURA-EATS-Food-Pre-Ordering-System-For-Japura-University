"use client";
// src/app/checkout/components/DiningOption.tsx
import React from 'react';
import { useCheckout } from './CheckoutContext';
import { Utensils, ShoppingBag } from 'lucide-react';

const DiningOption: React.FC = () => {
  const { diningOption, setDiningOption } = useCheckout();

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full">
      <h3 className="text-xl font-extrabold text-gray-900 border-b border-gray-300/50 !pb-4 !mb-5">
        Dining Option
      </h3>

      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
        {/* Dine-in Option */}
        <button
          onClick={() => setDiningOption('Dine-in')}
          className={`!w-full !p-4 !rounded-xl !border !text-left !transition-all !relative !overflow-hidden !flex !items-center !gap-3 !cursor-pointer
            ${diningOption === 'Dine-in'
              ? '!bg-[#B52222] !border-[#B52222] !text-white !shadow-md !scale-[1.02]'
              : '!bg-white/60 hover:!bg-white hover:!border-gray-300 !border-white/50 !text-gray-800 !shadow-sm'
            }`}
        >
          <div className={`!p-2 !rounded-lg !shrink-0 ${diningOption === 'Dine-in' ? '!bg-white/20' : '!bg-[#B52222]/10'}`}>
            <Utensils className={`!w-6 !h-6 ${diningOption === 'Dine-in' ? '!text-white' : '!text-[#B52222]'}`} />
          </div>
          <div className="!flex !flex-col !flex-1">
            <span className="!font-bold !text-[14px] sm:!text-[15px] !tracking-tight">Dine-in</span>
            <span className={`!text-[11px] !font-medium ${diningOption === 'Dine-in' ? '!text-white/80' : '!text-gray-500'}`}>
              Eat at the canteen
            </span>
          </div>

          {diningOption === 'Dine-in' && (
            <div className="!absolute !top-1/2 !-translate-y-1/2 !right-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="!text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
        </button>

        {/* Takeaway Option */}
        <button
          onClick={() => setDiningOption('Takeaway')}
          className={`!w-full !p-4 !rounded-xl !border !text-left !transition-all !relative !overflow-hidden !flex !items-center !gap-3 !cursor-pointer
            ${diningOption === 'Takeaway'
              ? '!bg-[#B52222] !border-[#B52222] !text-white !shadow-md !scale-[1.02]'
              : '!bg-white/60 hover:!bg-white hover:!border-gray-300 !border-white/50 !text-gray-800 !shadow-sm'
            }`}
        >
          <div className={`!p-2 !rounded-lg !shrink-0 ${diningOption === 'Takeaway' ? '!bg-white/20' : '!bg-[#B52222]/10'}`}>
            <ShoppingBag className={`!w-6 !h-6 ${diningOption === 'Takeaway' ? '!text-white' : '!text-[#B52222]'}`} />
          </div>
          <div className="!flex !flex-col !flex-1">
            <span className="!font-bold !text-[14px] sm:!text-[15px] !tracking-tight">Takeaway</span>
            <span className={`!text-[11px] !font-medium ${diningOption === 'Takeaway' ? '!text-white/80' : '!text-gray-500'}`}>
              Pack it to go
            </span>
          </div>

          {diningOption === 'Takeaway' && (
            <div className="!absolute !top-1/2 !-translate-y-1/2 !right-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="!text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DiningOption;
