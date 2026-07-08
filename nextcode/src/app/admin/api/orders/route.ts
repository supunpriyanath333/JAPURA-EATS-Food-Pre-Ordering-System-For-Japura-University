// src/app/admin/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const supabase = supabaseServer();

// --- MAPPING DB STATUS TO FRONTEND STATUS TYPE ---
type DBStatus = 'pending' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'delivered' | 'cancelled';
type FrontendStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';

const mapStatusToFrontend = (dbStatus: DBStatus): FrontendStatus => {
    switch (dbStatus) {
        case 'accepted': // DB default state
            return 'pending'; // New request in frontend
        case 'preparing':
            return 'preparing'; // Seller accepted & preparing
        case 'ready_for_pickup':
            return 'ready';
        case 'delivered':
            return 'picked_up';
        case 'cancelled':
            return 'cancelled';
        default:
            return 'pending';
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
        orderItems.forEach((foodItem: any) => {
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
                otp,
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

            // Format pickup_time as range if it isn't already
            let formattedPickupTime = order.pickup_time || 'ASAP';
            if (formattedPickupTime !== 'ASAP' && !formattedPickupTime.includes('-')) {
                // simple format logic: assume it's like "12:30 PM", add 15 mins for mock
                formattedPickupTime = `${formattedPickupTime} - ${formattedPickupTime} (+15m)`;
            }

            return {
                id: order.id,
                // Using real OTP if exists, fallback to '****'
                otp: order.otp || "****",
                // FIX 1: Map the DB status string to the defined Frontend type (accepted, preparing, ready, picked_up)
                status: mapStatusToFrontend(rawStatus), 
                // FIX 2: Use Number() on the total_amount (which is numeric/string from DB)
                total: Number(order.total_amount), 
                // FIX 3: Map items array to required OrderItem format with mocked special instructions
                items: order.order_items.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    // Mock special instructions for demo purposes (mostly show it)
                    special_instructions: 'Make it extra spicy'
                })),
                // Date/Time formatting
                date: createdAt.toLocaleDateString('en-CA'), // YYYY-MM-DD format approximation
                time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                pickup_time: formattedPickupTime,
                // FIX 4: Map payment_method string to 'Card' | 'Cash' (title-cased)
                payment: order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1) as 'Card' | 'Cash', 
                diningOption: Math.random() > 0.5 ? 'Dine-in' : 'Takeaway' // Mocked for now
            };
        });

        return NextResponse.json({ orders: transformedOrders }, { status: 200 });

    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}