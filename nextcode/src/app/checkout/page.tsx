// src/app/checkout/page.tsx

import { type NextPage } from 'next';
import React from 'react';
import YourCart from '../components/YourCart';
import PickupTimeSlot from '../components/PickupTimeSlot';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { Header } from '../components';
import { CheckoutProvider } from '../components/CheckoutContext';


const CheckoutPage: NextPage = () => {
  return (
    <CheckoutProvider>
      <div className="min-h-screen bg-gray-50">
      <main 
        className="container mx-auto" 
        style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <YourCart />
            <PickupTimeSlot />
            <PaymentMethod />
          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;