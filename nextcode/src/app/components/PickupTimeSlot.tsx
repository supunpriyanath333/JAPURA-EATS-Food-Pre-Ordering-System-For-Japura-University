"use client";
// src/app/checkout/components/PickupTimeSlot.tsx
import React, { useState } from 'react';
import { useCheckout } from './CheckoutContext';

const timeSlotBreakFast = [
  '07.00 AM - 07.15 AM',
  '07.15 AM - 07.30 AM',
  '07.30 AM - 07.45 AM',
  '07.45 AM - 08.00 AM',
  '08.00 AM - 08.15 AM',
  '08.15 AM - 08.30 AM',
  '08.30 AM - 08.45 AM',
  '08.45 AM - 09.00 AM',
  '09.00 AM - 09.15 AM',
  '09.15 AM - 09.30 AM',
  '09.30 AM - 09.45 AM',
  '09.45 AM - 10.00 AM',
];

const timeSlotsLunch = [
  '11.00 AM - 11.15 AM',
  '11.15 AM - 11.30 AM',
  '11.30 AM - 11.45 AM',
  '11.45 AM - 12.00 PM',
  '12.00 PM - 12.15 PM',
  '12.15 PM - 12.30 PM',
  '12.30 PM - 12.45 PM',
  '12.45 PM - 01.00 PM',
];


const timeSlotsDinner = [
  '05.30 PM - 05.45 PM',
  '05.45 PM - 06.00 PM',
  '06.00 PM - 06.15 PM',
  '06.15 PM - 06.30 PM',
  '06.30 PM - 06.45 PM',
  '06.45 PM - 07.00 PM',
  '07.00 PM - 07.15 PM',
  '07.15 PM - 07.30 PM',
  '07.30 PM - 07.45 PM',
  '07.45 PM - 08.00 PM',
  '08.00 PM - 08.15 PM',
  '08.15 PM - 08.30 PM',
];


const PickupTimeSlot: React.FC = () => {
  const { selectedTimeSlot, setSelectedTimeSlot } = useCheckout();
  const RED_COLOR = '#B52222';

  const SlotButton: React.FC<{ slot: string }> = ({ slot }) => {
    const isActive = slot === selectedTimeSlot;

    return (
      <button
        onClick={() => setSelectedTimeSlot(slot)}
        className={`w-full text-sm font-medium rounded-lg border transition-colors 
          ${isActive 
            ? 'text-white shadow-sm' 
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        style={{ 
          backgroundColor: isActive ? RED_COLOR : undefined, 
          borderColor: isActive ? RED_COLOR : undefined,
          paddingTop: '0.5rem', // py-2 equivalent
          paddingBottom: '0.5rem', // py-2 equivalent
          paddingLeft: '0.75rem', // px-3 equivalent
          paddingRight: '0.75rem', // px-3 equivalent
        }}
      >
        {slot}
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
        Select A Pick Up Time Slot
      </h3>
      <h3 
        className="text-base font-semibold text-gray-800" 
        style={{ marginBottom: '1rem', marginTop:'1rem'}} // mb-4 pb-4 equivalent
      >
        Breakfast

      </h3>
      <div 
        className="grid grid-cols-2" 
        style={{ gap: '1rem' }} // gap-4 equivalent
      >
        {timeSlotBreakFast.map((slot, index) => (
          <SlotButton key={index} slot={slot} />
        ))}
      </div>
      <div>
      <h3 
        className="text-base font-semibold text-gray-800" 
        style={{ marginBottom: '1rem', marginTop:'1rem'}} // mb-4 pb-4 equivalent
      >
        Lunch
      </h3>
      <div 
        className="grid grid-cols-2" 
        style={{ gap: '1rem' }} // gap-4 equivalent
      >
        
        {timeSlotsLunch.map((slot, index) => (
          <SlotButton key={index} slot={slot} />
        ))}
      </div>
      </div>
      <div>
      <h3 
        className="text-base font-semibold text-gray-800" 
        style={{ marginBottom: '1rem', marginTop:'1rem'}} // mb-4 pb-4 equivalent
      >
        Dinner
      </h3>
      <div 
        className="grid grid-cols-2" 
        style={{ gap: '1rem' }} // gap-4 equivalent
      >
        
        {timeSlotsDinner.map((slot, index) => (
          <SlotButton key={index} slot={slot} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default PickupTimeSlot;