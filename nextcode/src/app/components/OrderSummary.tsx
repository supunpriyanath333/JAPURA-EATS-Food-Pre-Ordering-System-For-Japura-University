"use client";

// src/app/checkout/components/OrderSummary.tsx
import React, { useState } from 'react';
// Assume useCart is imported from your implemented CartContext.tsx
import { useCart } from './CartContext'; 
import { useCheckout } from './CheckoutContext';

// --- MOCK CHECKOUT HOOK (TODO: Replace with your actual implementation) ---
// This hook simulates retrieving the currently selected options from other components.
interface CheckoutContextType {
selectedTimeSlot: string; // e.g., "07.45 AM - 08.00 AM"
selectedPaymentMethod: 'card' | 'cash';
}


const OrderSummary: React.FC = () => {
// Hooks
const { cartItems, cartTotal, clearCart} = useCart();
const { selectedTimeSlot, selectedPaymentMethod } = useCheckout();


// State for UI feedback
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

// Calculations
const subTotal = cartTotal;
const serviceFee = 0;
const total = subTotal + serviceFee;

// Styles
const RED_COLOR = '#B52222';
const PICKUP_SLOT_BG = '#e6eac7';

// --- Order Placement Handler ---
const handlePlaceOrder = async () => {
  if (total <= 0) {
    setError("Your cart is empty.");
    return;
  }

  setIsLoading(true);

  const session = JSON.parse(localStorage.getItem("supabase_session") || "{}");

  if (!session.user || !session.user.id) {
    setError("You are not logged in.");
    setIsLoading(false);
    return;
  }

  const payload = {
    user_id: session.user.id,
    pickup_time: selectedTimeSlot,
    payment_method: selectedPaymentMethod,
    client_total: total,
    cart_items: cartItems,   // <<< IMPORTANT
  };

  const response = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error);
    setIsLoading(false);
    return;
  }

  clearCart();
  setSuccess(`Order placed! ID: ${data.orderId}`);
  setIsLoading(false);
};


// -----------------------------------


const SummaryRow: React.FC<{ label: string, value: number, isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
<div 
className={`flex justify-between ${isTotal ? 'font-bold text-lg' : 'text-gray-700'}`}
style={{ 
paddingTop: isTotal ? '0.5rem' : '0', // pt-2 equivalent
marginTop: isTotal ? '0.5rem' : '0', // mt-2 equivalent
borderTop: isTotal ? '1px solid #e5e7eb' : 'none' // border-t equivalent
}}
>
<span>{label}</span>
<span>Rs. {value.toFixed(0)}</span>
</div>
);

return (
<div 
className="bg-white shadow-md rounded-lg border border-gray-100 sticky top-4"
style={{ padding: '1.5rem' }} // p-6 equivalent
>
<h3 
className="text-xl font-semibold text-gray-800 border-b" 
style={{ marginBottom: '1rem', paddingBottom: '1rem' }} // mb-4 pb-4 equivalent
>
Order Summary
</h3>

<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}> {/* space-y-1 equivalent */}
<SummaryRow label="Sub Total" value={subTotal} /> 
<SummaryRow label="Service Fee" value={serviceFee} />
<SummaryRow label="Total" value={total} isTotal={true} />
</div>
      
      {/* Feedback Messages */}
      {error && (
<div className="text-red-600 text-sm mt-4 p-2 bg-red-50 rounded font-medium">{error}</div>
)}
{success && (
<div className="text-green-600 text-sm mt-4 p-2 bg-green-50 rounded font-medium">{success}</div>
)}


<div 
style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }} // mt-6 space-y-4 equivalent
>
{/* Pickup Time Slot Display Button */}
<button 
className="w-full rounded-md text-gray-800 font-medium shadow-sm transition-colors"
style={{ 
backgroundColor: PICKUP_SLOT_BG, 
border: '1px solid #c7d5a5',
paddingTop: '0.75rem', // py-3 equivalent
paddingBottom: '0.75rem' // py-3 equivalent
}}
>
Pick Up Time Slot
<div className="text-sm font-bold" style={{ marginTop: '0.125rem' }}>{selectedTimeSlot}</div>
</button>

{/* Place Order Button */}
<button
onClick={handlePlaceOrder}
          disabled={isLoading || total <= 0}
className="w-full rounded-md text-white font-bold shadow-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
style={{ 
backgroundColor: RED_COLOR,
paddingTop: '0.75rem', // py-3 equivalent
paddingBottom: '0.75rem' // py-3 equivalent
}}
>
{isLoading ? 'Placing Order...' : 'PLACE ORDER'}
</button>
</div>

<p 
className="text-xs text-center text-gray-500" 
style={{ marginTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }} // mt-4 px-4 equivalent
>
You will receive a pickup OTP after placing the order. Check Your Active Orders.
</p>
</div>
);
};

export default OrderSummary;