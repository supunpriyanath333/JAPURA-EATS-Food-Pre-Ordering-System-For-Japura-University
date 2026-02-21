// orders/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
// Assuming Header is imported correctly
import { Inter } from "next/font/google";
import Header from "../components/Header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// --- INTERFACES ---
type OrderStatus = "Order Accepted" | "Preparing" | "Ready to Pick up" | "Picked up";
type OrderType = "Active Orders" | "Order History";

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface OrderFeedback {
  rating: number;
  comment?: string;
}

interface Order {
  id: string;
  canteenName: string;
  date: string;
  time: string;
  status: OrderStatus[];
  otp?: string;
  items: OrderItem[];
  total: number;
  pickUpTime: string; 
  paymentMethod: "Online" | "Cash" | "Card";
  feedback?: OrderFeedback;
  isPickedUp?: boolean;
}

// --- DATA TRANSFORMATION LOGIC ---
const formatOrders = (rawOrders: any[]): Order[] => {
    return rawOrders.map((order: any) => {
        
        const firstOrderItem = order.order_items[0];
        const canteenName = firstOrderItem?.food_items?.[0]?.canteens?.[0]?.name || "Unknown Canteen";

        const items: OrderItem[] = (order.order_items || []).map((oi: any) => ({
            quantity: oi.quantity,
            name: oi.name || 'Unknown Item',
            price: Number(oi.price),
        }));

        const dbStatus = order.status?.toLowerCase() || 'pending'; 
        const isHistoryStatus = dbStatus === 'delivered' || dbStatus === 'cancelled'; 
        
        let statusList: OrderStatus[] = ["Order Accepted"];
        if (dbStatus === 'accepted' || dbStatus === 'pending') statusList = ["Order Accepted"];
        if (dbStatus === 'preparing') statusList = ["Order Accepted", "Preparing"];
        if (dbStatus === 'ready_for_pickup') statusList = ["Order Accepted", "Preparing", "Ready to Pick up"];
        if (isHistoryStatus) statusList = ["Order Accepted", "Preparing", "Ready to Pick up", "Picked up"];
        
        
        const createdAt = new Date(order.created_at);
        const date = createdAt.toLocaleDateString('en-GB'); 
        const time = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const paymentMethod = (order.payment_method === 'cash' ? 'Cash' : order.payment_method === 'card' ? 'Card' : 'Online') as "Online" | "Cash" | "Card";
        
        return {
            id: order.id.substring(0, 8).toUpperCase(),
            canteenName: canteenName,
            date: date,
            time: time,
            status: statusList,
            otp: isHistoryStatus ? undefined : '****', 
            items: items,
            total: Number(order.total_amount),
            pickUpTime: order.pickup_time || 'N/A',
            paymentMethod: paymentMethod,
            isPickedUp: isHistoryStatus,
            feedback: undefined,
        };
    });
};


// --- OrderCard Component (unchanged) ---
function OrderCard({ order, isHistory = false }: { order: Order; isHistory?: boolean }) {
    const statusSteps: OrderStatus[] = ["Order Accepted", "Preparing", "Ready to Pick up", "Picked up"];
    const currentStatusIndex = statusSteps.findIndex(
        (step) => step === order.status[order.status.length - 1]
    );
    // Ensure index is valid for coloring (0 for "Order Accepted" if not found higher)
    const validCurrentStatusIndex = Math.max(currentStatusIndex, 0); 


    const handleOrderAgain = (orderId: string) => {
        console.log("Order again:", orderId);
    };

    return (
        <div
          className={`bg-white rounded-lg border border-gray-300 mb-6 ${inter.className}`}
          style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem", marginTop: "2rem" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
  {/* Left Section */}
  <div className="flex flex-col">
    <h3 className={`${inter.className} text-lg font-bold text-black`}>
      Order - {order.id}
    </h3>
    <p className={`${inter.className} text-sm text-gray-600`}>
      From - {order.canteenName}
    </p>

    {isHistory && (
      <p className={`${inter.className} text-sm text-gray-700 mt-1`}>
        {order.date}, {order.time}
      </p>
    )}
  </div>

  {/* Right Section (Only for NON-History Orders) */}
  {!isHistory && (
    <div className="text-right">
      <p className={`${inter.className} text-sm font-semibold text-black`}>
        {order.date}
      </p>
      <p className={`${inter.className} text-sm text-gray-600`}>
        {order.time}
      </p>
    </div>
  )}
</div>

{/* Picked Up Indicator (History Mode) */}
{isHistory && order.isPickedUp && (
  <div className="flex items-center gap-2 mb-4">
    <svg
      className="w-5 h-5 text-[#22c55e]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
    <span className={`${inter.className} text-sm font-medium text-[#22c55e]`}>
      Picked up
    </span>
  </div>
)}


          {/* Status Progress Bar - Only for Active Orders */}
          {!isHistory && (
            <><div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
<div className="flex items-center justify-between" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem"}}>
  {statusSteps.map((step, index) => {
    const isActive = index <= validCurrentStatusIndex;
    const isCurrent = index === validCurrentStatusIndex;

    return (
      <div key={step} className="flex items-center flex-1">
        {/* Step Circle */}
        <div className="flex flex-col items-center flex-1" >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isActive
                ? "bg-green-500 border-green-500 text-white shadow"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}
            
          >
            {step === "Order Accepted" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}

            {step === "Preparing" && (
              <svg
                className={`w-5 h-5 ${isCurrent ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}

            {step === "Ready to Pick up" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            )}

            {step === "Picked up" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Step Label */}
          <p
            className={`${inter.className} mt-2 text-xs text-center transition-all ${
              isActive ? "text-gray-900 font-medium" : "text-gray-400"
            }`}
          >
            {step}
          </p>
        </div>

        {/* Connecting Line */}
        {index < statusSteps.length - 1 && (
          <div
            className={`flex-1 h-1 mx-2 rounded-full transition-all ${
              index < validCurrentStatusIndex
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
        )}
      </div>
    );
  })}
</div>
</div>

{/* OTP Display */}
{order.otp && (
<div className="mb-6" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
  <p className={`${inter.className} text-sm text-gray-600 mb-1`}>
    Your OTP
  </p>
  <p className={`${inter.className} text-4xl font-extrabold text-red-600 tracking-widest`}>
    {order.otp}
  </p>
</div>
)}
</>
          )}

{/* Items + Summary (2 columns on md+, stacked on mobile) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

  {/* Item Details */}
  <div className="bg-white">
    {order.items.map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-between py-2 border-b last:border-none"
        style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}
      >
        <div className="flex flex-col">
          <span className={`${inter.className} text-sm font-medium text-black`}>
            {item.name}
          </span>
          <span className={`${inter.className} text-xs text-gray-500`}>
            Qty: {item.quantity}
          </span>
        </div>

        <span className={`${inter.className} text-base font-semibold text-black`}>
          Rs. {item.price}
        </span>
      </div>
    ))}
  </div>

  {/* Summary */}
  <div className="border-t md:border-t-0 md:border-l md:pl-6 border-gray-200">
    <div className="flex items-center justify-between py-2" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
      <span className={`${inter.className} text-sm text-gray-600`}>
        Total
      </span>
      <span className={`${inter.className} text-lg font-semibold text-black`} >
        Rs. {order.total}
      </span>
    </div>

    <div className="flex items-center justify-between py-2" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
      <span className={`${inter.className} text-sm text-gray-600`}>
        Pick Up Time
      </span>
      <span className={`${inter.className} text-sm font-medium text-black`}>
        {order.pickUpTime}
      </span>
    </div>

    <div className="flex items-center justify-between py-2" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
      <span className={`${inter.className} text-sm text-gray-600`}>
        Payment
      </span>
      <span className={`${inter.className} text-sm font-medium text-black`}>
        {order.paymentMethod}
      </span>
    </div>
  </div>

</div>



          {/* Feedback Section - Only for Order History */}
          {isHistory && (
  <div className="mb-4 flex gap-4 py-4">

    {/* Feedback Box */}
    <div className="flex-1 bg-gray-100 border border-gray-300 rounded-xl p-4">
      {order.feedback ? (
        <div className="flex flex-col gap-2 py-2">

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= order.feedback!.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-300 text-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Comment */}
          {order.feedback.comment && (
            <p className={`${inter.className} text-sm text-gray-700`}>
              {order.feedback.comment}
            </p>
          )}
        </div>
      ) : (
        // No feedback yet
        <div className="flex items-center gap-2 py-2 justify-center" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>

          <span className={`${inter.className} text-sm text-gray-600`}>
            Leave a Feedback
          </span>
        </div>
      )}
    </div>

    {/* Order Again Button */}
    <button
      onClick={() => handleOrderAgain(order.id)}
      className={`${inter.className} flex-1 bg-[#B52222] text-white font-semibold rounded-xl py-3
                  hover:bg-[#9a1e1e] active:scale-[0.98] transition-all duration-200 text-center`}
                  style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem"}}
    >
      Order Again
    </button>
  </div>
)}

        </div>
      );
}


// --- OrdersPage Component (Main component) ---
export default function OrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[] | null>(null);
    const [orderType, setOrderType] = useState<OrderType>("Active Orders");
    const [isLoading, setIsLoading] = useState(true);

    // FIX: Wrap fetchOrders in useCallback for stable dependency in useEffect
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Get the stored session and extract the email
            const sessionString = localStorage.getItem("supabase_session"); 
            
            if (!sessionString) {
                console.error("Authentication session data not found in localStorage. Please log in.");
                return;
            }
            
            let sessionData;
            try {
                sessionData = JSON.parse(sessionString);
            } catch (e) {
                console.error("Failed to parse session data.");
                return;
            }

            // 2. EXTRACT THE EMAIL from the confirmed structure: {user: {email: '...'}}
            const userEmail = sessionData.user?.email;

            if (!userEmail) {
                console.error("User email not found in session data. Structure might be incorrect.");
                return;
            }
            
            // 3. Make the API request, sending the email via a custom header
            const res = await fetch("/api/order/get_order", {
                headers: {
                    // Send user identification via a custom header
                    "X-User-Email": userEmail, 
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("API Error fetching orders:", errorData.error);
                setAllOrders([]);
                return;
            }

            const data = await res.json();
            const formattedOrders = formatOrders(data.orders || []);
            setAllOrders(formattedOrders); 

        } catch (err) {
            console.error("Failed to load orders or encountered network error.", err);
            setAllOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Run on mount
    useEffect(() => {
        fetchOrders();
        // 🎯 FIX: Implement Polling
        const intervalId = setInterval(() => {
          console.log("Polling for order status updates...");
          fetchOrders();
        }, 10000);
        
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [fetchOrders]); // fetchOrders is now stable due to useCallback
    
    // Filter orders based on the selected tab
    const filteredOrders = (allOrders || []).filter(order => {
        const isHistory = order.isPickedUp || order.status.includes("Picked up");

        if (orderType === "Active Orders") {
            return !isHistory;
        } else { // Order History
            return isHistory;
        }
    });

    const navItems = [
    // ... (Navigation items remain unchanged)
    {
      label: "HOME",
      href: "/",
      isActive: false,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "CANTEENS",
      href: "/canteens",
      isActive: false,
      icon: (
        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "ORDERS",
      href: "/orders",
      isActive: true,
      icon: (
        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

    return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}

      {/* Order Type Tabs */}
<section className="bg-white border-t border-b border-gray-200" >
  <div className="container mx-auto px-4">
    <div className="flex justify-center" >
      <div className="inline-flex items-center rounded-full border border-black/20 bg-[rgb(var(--color-hero-bg))]/[0.69] px-4 py-2 shadow-sm">

        {/* Active Orders */}
        <button
        style={{paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem"}}
          onClick={() => setOrderType("Active Orders")}
          className={`
            ${inter.className}
            font-bold text-xs md:text-sm
            px-6 md:px-8
            py-2 md:py-3
            rounded-full transition-all duration-200
            ${orderType === "Active Orders"
              ? "bg-[#B52222] text-white shadow-inner border border-black/40"
              : "bg-transparent text-black"
            }
          `}
        >
          Active Orders
        </button>

        {/* Order History */}
        <button
          onClick={() => setOrderType("Order History")}
          style={{paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem"}}
          className={`
            ${inter.className}
            font-bold text-xs md:text-sm
            px-6 md:px-8
            py-2 md:py-3
            rounded-full transition-all duration-200
            ${orderType === "Order History"
              ? "bg-[#B52222] text-white shadow-inner border border-black/40"
              : "bg-transparent text-black"
            }
          `}
        >
          Order History
        </button>

      </div>
    </div>
  </div>
</section>



      {/* Orders List */}
      <section
        className="px-4 bg-white"
      >
        <div className="container mx-auto">
          {isLoading ? (
                <div className={`text-center py-12 ${inter.className}`}>
                    <p className="text-gray-500 text-lg">Loading orders...</p>
                    {/* Add a simple SVG spinner here if desired */}
                </div>
            ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} isHistory={orderType === "Order History"} />
            ))
          ) : (
            <div className={`text-center py-12 ${inter.className}`}>
              <p className="text-gray-500 text-lg">No {orderType.toLowerCase()} found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}