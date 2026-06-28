// orders/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
// Assuming Header is imported correctly
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import OrderCard, { Order, OrderStatus, OrderType, OrderItem, OrderFeedback } from "../components/OrderCard";

// --- DATA TRANSFORMATION LOGIC ---
const formatOrders = (rawOrders: any[]): Order[] => {
    return rawOrders.map((order: any) => {
        
        const firstOrderItem = order.order_items[0];
        const canteenName = firstOrderItem?.food_items?.[0]?.canteens?.[0]?.name || "Unknown Canteen";
        const canteenId = firstOrderItem?.food_items?.[0]?.canteens?.[0]?.id;

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
        const diningOption = order.dining_option || 'Takeaway';
        
        return {
            id: order.id.substring(0, 8).toUpperCase(),
            canteenName: canteenName,
            canteenId: canteenId,
            date: date,
            time: time,
            status: statusList,
            otp: isHistoryStatus ? undefined : (order.otp || '****'), 
            items: items,
            total: Number(order.total_amount),
            pickUpTime: order.pickup_time || 'N/A',
            paymentMethod: paymentMethod,
            diningOption: diningOption,
            isPickedUp: isHistoryStatus,
            feedback: undefined,
        };
    });
};


// Component imported from OrderCard.tsx


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
    <div className="!min-h-screen !pb-12">
      {/* Header */}

      {/* Order Type Tabs */}
      <section className="!pt-8 !pb-6">
        <div className="!container !mx-auto !px-4">
          <div className="!flex !justify-center">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '9999px', padding: '8px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 24px rgba(31, 38, 135, 0.08), inset 0 2px 4px rgba(255,255,255,0.5)'
            }}>

              {/* Active Orders */}
              <button
                onClick={() => setOrderType("Active Orders")}
                className={inter.className}
                style={{
                  padding: '10px 28px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  background: orderType === "Active Orders" ? '#B52222' : 'transparent',
                  color: orderType === "Active Orders" ? '#fff' : '#6b7280',
                  boxShadow: orderType === "Active Orders" ? '0 2px 8px rgba(181,34,34,0.3)' : 'none',
                }}
              >
                Active Orders
              </button>

              {/* Order History */}
              <button
                onClick={() => setOrderType("Order History")}
                className={inter.className}
                style={{
                  padding: '10px 28px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  background: orderType === "Order History" ? '#B52222' : 'transparent',
                  color: orderType === "Order History" ? '#fff' : '#6b7280',
                  boxShadow: orderType === "Order History" ? '0 2px 8px rgba(181,34,34,0.3)' : 'none',
                }}
              >
                Order History
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="!px-4">
        <div className="!container !mx-auto !max-w-4xl">
          {isLoading ? (
                <div className={`!text-center !py-12 ${inter.className}`}>
                    <p className="!text-gray-600 !text-lg !font-medium">Loading orders...</p>
                </div>
            ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} isHistory={orderType === "Order History"} />
            ))
          ) : (
            <div className={`!text-center !py-12 !bg-white/30 !backdrop-blur-md !border !border-white/50 !rounded-[24px] ${inter.className}`}>
              <p className="!text-gray-600 !text-lg !font-medium">No {orderType.toLowerCase()} found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}