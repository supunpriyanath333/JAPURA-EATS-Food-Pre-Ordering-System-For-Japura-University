"use client";
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useCheckout } from './CheckoutContext';
import { Clock, CreditCard, Banknote, Utensils, ShoppingBag, ShoppingCart } from 'lucide-react';

const OrderSummary: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { selectedTimeSlot, selectedPaymentMethod, diningOption } = useCheckout();
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const subTotal = cartTotal;
  const serviceFee = 0;
  const total = subTotal + serviceFee;

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
      dining_option: diningOption,
      client_total: total,
      cart_items: cartItems,
    };

    try {
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
    } catch (err) {
      setError("Failed to place order. Please try again.");
    }
    setIsLoading(false);
  };

  const SummaryRow: React.FC<{ label: string, value: number, isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`!flex !justify-between !items-center ${isTotal ? '!font-extrabold !text-[16px] sm:!text-[18px] !text-[#B52222] !mt-2 !pt-3 !border-t !border-gray-300/50' : '!font-medium !text-[14px] !text-gray-700'}`}>
      <span>{label}</span>
      <span>Rs. {value.toFixed(0)}</span>
    </div>
  );

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-lg !p-5 sm:!p-6 !w-full !sticky !top-24">
      <h3 className="text-xl font-extrabold text-gray-900 border-b border-gray-300/50 !pb-4 !mb-5">
        Order Summary
      </h3>

      <div className="!flex !flex-col !gap-3 !mb-6">
        <SummaryRow label="Sub Total" value={subTotal} />
        <SummaryRow label="Service Fee" value={serviceFee} />
        <SummaryRow label="Total" value={total} isTotal={true} />
      </div>

      {/* Selected Options Summary */}
      <div className="!bg-white/50 !border !border-white/60 !rounded-xl !p-4 !mb-6 !flex !flex-col !gap-3">
        <h4 className="!text-[13px] !font-bold !text-gray-800 !uppercase !tracking-wider !mb-1">Order Details</h4>

        {/* Item Count */}
        <div className="!flex !items-center !gap-3">
          <div className="!p-1.5 !bg-white/60 !backdrop-blur-sm !border !border-white/50 !text-gray-700 !rounded-md !shadow-sm">
            <ShoppingCart className="!w-4 !h-4" />
          </div>
          <div className="!flex !flex-col">
            <span className="!text-[11px] !font-medium !text-gray-500 !leading-none">Total Items</span>
            <span className="!text-[13px] !font-bold !text-gray-800">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
          </div>
        </div>

        {/* Time Slot */}
        <div className="!flex !items-center !gap-3">
          <div className="!p-1.5 !bg-white/60 !backdrop-blur-sm !border !border-white/50 !text-gray-700 !rounded-md !shadow-sm">
            <Clock className="!w-4 !h-4" />
          </div>
          <div className="!flex !flex-col">
            <span className="!text-[11px] !font-medium !text-gray-500 !leading-none">Pick Up Time</span>
            <span className="!text-[13px] !font-bold !text-gray-800">{selectedTimeSlot}</span>
          </div>
        </div>

        {/* Dining Option */}
        <div className="!flex !items-center !gap-3">
          <div className="!p-1.5 !bg-white/60 !backdrop-blur-sm !border !border-white/50 !text-gray-700 !rounded-md !shadow-sm">
            {diningOption === 'Dine-in' ? <Utensils className="!w-4 !h-4" /> : <ShoppingBag className="!w-4 !h-4" />}
          </div>
          <div className="!flex !flex-col">
            <span className="!text-[11px] !font-medium !text-gray-500 !leading-none">Dining Option</span>
            <span className="!text-[13px] !font-bold !text-gray-800">{diningOption}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="!flex !items-center !gap-3">
          <div className="!p-1.5 !bg-white/60 !backdrop-blur-sm !border !border-white/50 !text-gray-700 !rounded-md !shadow-sm">
            {selectedPaymentMethod === 'cash' ? <Banknote className="!w-4 !h-4" /> : <CreditCard className="!w-4 !h-4" />}
          </div>
          <div className="!flex !flex-col">
            <span className="!text-[11px] !font-medium !text-gray-500 !leading-none">Payment Method</span>
            <span className="!text-[13px] !font-bold !text-gray-800 capitalize">{selectedPaymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="!text-red-600 !text-sm !mb-4 !p-3 !bg-red-50 !rounded-xl !font-medium !border !border-red-100">{error}</div>
      )}
      {success && (
        <div className="!text-green-600 !text-sm !mb-4 !p-3 !bg-green-50 !rounded-xl !font-medium !border !border-green-100">{success}</div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || total <= 0}
        className="!w-full !rounded-xl !text-white !font-extrabold !shadow-lg !transition-all !transform hover:!scale-[1.02] active:!scale-[0.98] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!scale-100 !bg-[#B52222] !py-4 !text-[15px]"
      >
        {isLoading ? 'Placing Order...' : 'PLACE ORDER'}
      </button>

      <p className="!text-xs !text-center !text-gray-600 !mt-4 !font-medium !leading-relaxed">
        You will receive a pickup PIN after placing the order. Check Your Active Orders.
      </p>
    </div>
  );
};

export default OrderSummary;