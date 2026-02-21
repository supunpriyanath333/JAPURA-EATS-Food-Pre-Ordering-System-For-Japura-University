// src/app/admin/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Use the Service Key for backend access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

// --- MAPPING DB STATUS TO FRONTEND STATUS TYPE ---
type DBStatus = 'pending' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'delivered' | 'cancelled';
type FrontendStatus = 'accepted' | 'preparing' | 'ready' | 'picked_up';

const mapStatusToFrontend = (dbStatus: DBStatus): FrontendStatus => {
    switch (dbStatus) {
        case 'pending':
        case 'accepted':
            return 'accepted';
        case 'preparing':
            return 'preparing';
        case 'ready_for_pickup':
            return 'ready';
        case 'delivered':
        case 'cancelled': // Assuming cancelled is treated as history/final state
            return 'picked_up';
        default:
            return 'accepted';
    }
};

/**
 * Fetches all active orders (not 'delivered' or 'cancelled') related to a specific canteen.
 * The canteenId must be passed as a query parameter: /api/admin/orders?canteenId=YOUR_UUID
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const canteenId = searchParams.get('canteenId');
        
        // NOTE: Add Authorization check here (e.g., verifying seller credentials)

        if (!canteenId) {
            return NextResponse.json({ error: "Missing canteenId query parameter." }, { status: 400 });
        }

        // 1. Fetch Order IDs that belong to the Canteen
        const { data: orderItems, error: itemsError } = await supabase
            .from("food_items")
            .select(`
                order_items (order_id)
            `)
            .eq("canteen_id", canteenId);

        if (itemsError) {
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }
        
        const orderIds = new Set<string>();
        orderItems.forEach(foodItem => {
            if (foodItem.order_items) {
                foodItem.order_items.forEach((item: { order_id: string }) => {
                    orderIds.add(item.order_id);
                });
            }
        });

        if (orderIds.size === 0) {
            return NextResponse.json({ orders: [] }, { status: 200 });
        }
        
        // 2. Fetch full Order details using the unique Order IDs
        // Fetch the raw DB status to allow filtering and mapping
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select(`
                id,
                total_amount,
                pickup_time,
                payment_method,
                created_at,
                status,
                order_items (name, quantity, price)
            `)
            .in("id", Array.from(orderIds))
            // Filter out final states (optional, but keeps the list clean for the seller)
            .not('status', 'in', '("delivered", "cancelled")')
            .order("created_at", { ascending: false });

        if (ordersError) {
            return NextResponse.json({ error: ordersError.message }, { status: 500 });
        }
        
        // 3. Transform Data to match Frontend 'Order' Interface (FIXED TYPE ERROR)
        const transformedOrders = (orders || []).map(order => {
            const createdAt = new Date(order.created_at);
            const rawStatus = order.status as DBStatus;

            return {
                id: order.id,
                // MOCK OTP as requested
                opt: "1234", 
                // FIX 1: Map the DB status string to the defined Frontend type (accepted, preparing, ready, picked_up)
                status: mapStatusToFrontend(rawStatus), 
                // FIX 2: Use Number() on the total_amount (which is numeric/string from DB)
                total: Number(order.total_amount), 
                // FIX 3: Map items array to required string[] format
                items: order.order_items.map(item => `${item.name} x ${item.quantity}`),
                // Date/Time formatting
                date: createdAt.toLocaleDateString('en-CA'), // YYYY-MM-DD format approximation
                time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                pickup_time: order.pickup_time,
                // FIX 4: Map payment_method string to 'Card' | 'Cash' (title-cased)
                payment: order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1) as 'Card' | 'Cash', 
            };
        });

        return NextResponse.json({ orders: transformedOrders }, { status: 200 });

    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}