// src/app/checkout/page.tsx

import { type NextPage } from 'next';
import React from 'react';
import YourCart from '../components/YourCart';
import PickupTimeSlot from '../components/PickupTimeSlot';
import DiningOption from '../components/DiningOption';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { Header } from '../components';
import { CheckoutProvider } from '../components/CheckoutContext';


const CheckoutPage: NextPage = () => {
  return (
    <CheckoutProvider>
      <div className="min-h-screen bg-transparent relative overflow-x-hidden !pb-24">
        
        {/* Background Orbs */}
        <div className="fixed top-[-5%] left-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(181,34,34,0.22)_0%,rgba(255,255,255,0)_70%)] blur-[100px] -z-10 pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(245,158,11,0.18)_0%,rgba(255,255,255,0)_70%)] blur-[110px] -z-10 pointer-events-none" />
        <div className="fixed top-[35%] right-[20%] w-[35vw] h-[35vw] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_75%)] blur-[120px] -z-10 pointer-events-none" />

        <main 
          className="relative z-10 container mx-auto !pt-8" 
          style={{ paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
        >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <YourCart />
            <PickupTimeSlot />
            <DiningOption />
            <PaymentMethod />
          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;