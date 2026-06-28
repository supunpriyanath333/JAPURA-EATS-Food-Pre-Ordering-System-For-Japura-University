"use client";
// src/app/checkout/components/PickupTimeSlot.tsx
import React, { useState, useEffect } from 'react';
import { useCheckout } from './CheckoutContext';

// Dynamically generated arrays for time slots to match 9.1 Daily Meal Serving Times
const timeSlotBreakFast = [
  '07.00 AM - 07.15 AM', '07.15 AM - 07.30 AM', '07.30 AM - 07.45 AM', '07.45 AM - 08.00 AM', 
  '08.00 AM - 08.15 AM', '08.15 AM - 08.30 AM', '08.30 AM - 08.45 AM', '08.45 AM - 09.00 AM', 
  '09.00 AM - 09.15 AM', '09.15 AM - 09.30 AM', '09.30 AM - 09.45 AM', '09.45 AM - 10.00 AM',
  '10.00 AM - 10.15 AM', '10.15 AM - 10.30 AM', '10.30 AM - 10.45 AM', '10.45 AM - 11.00 AM'
];

const timeSlotsLunch = [
  '11.30 AM - 11.45 AM', '11.45 AM - 12.00 PM', '12.00 PM - 12.15 PM', '12.15 PM - 12.30 PM',
  '12.30 PM - 12.45 PM', '12.45 PM - 01.00 PM', '01.00 PM - 01.15 PM', '01.15 PM - 01.30 PM',
  '01.30 PM - 01.45 PM', '01.45 PM - 02.00 PM', '02.00 PM - 02.15 PM', '02.15 PM - 02.30 PM',
  '02.30 PM - 02.45 PM', '02.45 PM - 03.00 PM'
];

const timeSlotsDinner = [
  '05.30 PM - 05.45 PM', '05.45 PM - 06.00 PM', '06.00 PM - 06.15 PM', '06.15 PM - 06.30 PM', 
  '06.30 PM - 06.45 PM', '06.45 PM - 07.00 PM', '07.00 PM - 07.15 PM', '07.15 PM - 07.30 PM', 
  '07.30 PM - 07.45 PM', '07.45 PM - 08.00 PM', '08.00 PM - 08.15 PM', '08.15 PM - 08.30 PM'
];

// Simple seeded random function based on string for stable mock generation
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const getMockOccupancy = (slot: string) => {
  const hash = Math.abs(hashString(slot + new Date().toDateString()));
  return hash % 25; // Mod 25 so some slots will hit the 20 max limit
};

const parseTimeToToday = (timeStr: string, currentPeriod: string, currentTime: Date) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split('.').map(Number);
  if (hours === 12) {
    hours = modifier === 'AM' ? 0 : 12;
  } else if (modifier === 'PM') {
    hours = hours + 12;
  }
  const date = new Date(currentTime);
  date.setHours(hours, minutes, 0, 0);

  // If ordering Breakfast between 5 PM and Midnight, the slot is for tomorrow morning.
  if (currentPeriod === 'Breakfast' && currentTime.getHours() >= 17) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

const getCurrentOrderPeriods = (time: Date) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const periods: string[] = [];

  // Breakfast: 5:00 PM (1020) to 6:30 AM (390) next day
  if (timeInMinutes >= 17 * 60 || timeInMinutes <= 6 * 60 + 30) {
    periods.push('Breakfast');
  }

  // Lunch: 6:00 AM (360) to 11:00 AM (660)
  if (timeInMinutes >= 6 * 60 && timeInMinutes < 11 * 60) {
    periods.push('Lunch');
  }

  // Dinner: 11:00 AM (660) to 5:00 PM (1020)
  if (timeInMinutes >= 11 * 60 && timeInMinutes < 17 * 60) {
    periods.push('Dinner');
  }

  return periods.length > 0 ? periods : ['Closed'];
};

const PickupTimeSlot: React.FC = () => {
  const { selectedTimeSlot, setSelectedTimeSlot } = useCheckout();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set time on client side to avoid hydration mismatch
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getSlotDetails = (slot: string, currentPeriod: string) => {
    const startTimeStr = slot.split(' - ')[0];
    const startTime = parseTimeToToday(startTimeStr, currentPeriod, currentTime!);
    
    // 1-hour buffer calculation
    const oneHourFromNow = new Date(currentTime!.getTime() + 60 * 60 * 1000);
    const isPastOrTooSoon = startTime < oneHourFromNow;
    
    // Mock Users calculation
    const users = getMockOccupancy(slot);
    const isFull = users >= 20;
    const isDisabled = isPastOrTooSoon || isFull;

    return { slot, isPastOrTooSoon, isFull, isDisabled, users: Math.min(users, 20) };
  };

  const SlotButton = ({ slot, currentPeriod }: { slot: string; currentPeriod: string }) => {
    if (!currentTime) return null; // Wait for hydration
    
    const { isPastOrTooSoon, isFull, isDisabled, users } = getSlotDetails(slot, currentPeriod);
    const isActive = slot === selectedTimeSlot;

    return (
      <button
        disabled={isDisabled}
        onClick={() => setSelectedTimeSlot(slot)}
        className={`!w-full !p-3 sm:!p-4 !rounded-xl !border !text-center !transition-all !relative !overflow-hidden !flex !flex-col !items-center !justify-center !gap-1.5
          ${isDisabled 
            ? '!opacity-60 !cursor-not-allowed !bg-gray-200/50 !border-gray-300/50 !text-gray-400' 
            : isActive 
              ? '!bg-[#B52222] !border-[#B52222] !text-white !shadow-md !scale-[1.02] !cursor-pointer' 
              : '!bg-white/60 hover:!bg-white hover:!border-gray-300 !border-white/50 !text-gray-800 !shadow-sm hover:!cursor-pointer'
          }`}
      >
        <span className="!font-bold !text-[13px] sm:!text-[14px] !tracking-tight">{slot}</span>
        
        {/* Status Badges */}
        {isPastOrTooSoon ? (
          <span className="!text-[10px] !font-extrabold !text-gray-500 !bg-gray-200/80 !px-2.5 !py-0.5 !rounded-full !uppercase !tracking-wider">Unavailable</span>
        ) : isFull ? (
          <span className="!text-[10px] !font-extrabold !text-red-600 !bg-red-100 !px-2.5 !py-0.5 !rounded-full !uppercase !tracking-wider">Full (20/20)</span>
        ) : (
          <span className={`!text-[10px] !font-extrabold !px-2.5 !py-0.5 !rounded-full !uppercase !tracking-wider ${isActive ? '!text-white/90 !bg-white/20' : '!text-green-700 !bg-green-100'}`}>
            {users}/20 Users
          </span>
        )}
      </button>
    );
  };

  const renderSection = (title: string, slots: string[]) => (
    <div className="!mb-8 last:!mb-0">
      <h4 className="!text-[15px] !font-extrabold !text-gray-800 !mb-4 !uppercase !tracking-widest !border-b !border-gray-300/50 !pb-2">
        {title} Time Slots
      </h4>
      <div className="!grid !grid-cols-2 lg:!grid-cols-3 !gap-3">
        {slots.map(slot => <SlotButton key={slot} slot={slot} currentPeriod={title} />)}
      </div>
    </div>
  );

  const currentPeriods = currentTime ? getCurrentOrderPeriods(currentTime) : [];
  const currentPeriodsStr = currentPeriods.join(' & ');

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full">
      <h3 className="text-xl font-extrabold text-gray-900 border-b border-gray-300/50 !pb-4 !mb-5">
        Select Pick Up Time
      </h3>


      <div className="!flex !flex-col !gap-2">
        {currentPeriods.includes('Breakfast') && renderSection('Breakfast', timeSlotBreakFast)}
        {currentPeriods.includes('Lunch') && renderSection('Lunch', timeSlotsLunch)}
        {currentPeriods.includes('Dinner') && renderSection('Dinner', timeSlotsDinner)}
      </div>
    </div>
  );
};

export default PickupTimeSlot;