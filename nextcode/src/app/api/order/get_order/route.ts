// api/order/get_order/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const supabase = supabaseServer();

// --- Utility: Extract User Email from Header ---
function getEmailFromHeader(req: NextRequest): string | null {
    // Read the custom header 'X-User-Email'
    return req.headers.get("X-User-Email");
}


/**
 * Fetches all orders for the user identified by the email passed in the header,
 * including order items and canteen name.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Authorization: Get email from custom header
        const userEmail = getEmailFromHeader(req);

        if (!userEmail) {
            return NextResponse.json(
                { error: "Authorization failed: Missing user identification header." },
                { status: 401 }
            );
        }

        // 2. Find the user ID based on the email
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

        if (userError || !userData) {
            console.error("User lookup failed:", userError);
            return NextResponse.json(
                { error: "User not found or database error during lookup." },
                { status: 401 }
            );
        }
        const userId = userData.id;


        // 3. Fetch Orders with necessary Joins (FIXED SELECT STATEMENT)
        let { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select(`
                id,
                pickup_time,
                payment_method,
                total_amount,
                created_at,
                status,
                otp, 
                refund_eligible,
                order_items (
                    quantity,
                    name,
                    price,
                    food_items:food_item_id (
                        canteens (id, name)
                    )
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (ordersError && ordersError.message.includes("refund_eligible")) {
            console.warn("refund_eligible column not found, falling back to query without it.");
            const fallbackResult = await supabase
                .from("orders")
                .select(`
                    id,
                    pickup_time,
                    payment_method,
                    total_amount,
                    created_at,
                    status,
                    otp, 
                    order_items (
                        quantity,
                        name,
                        price,
                        food_items:food_item_id (
                            canteens (id, name)
                        )
                    )
                `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false });
            
            ordersError = fallbackResult.error;
            orders = fallbackResult.data?.map(o => ({ ...o, refund_eligible: false })) || null;
        }

        if (ordersError) {
            console.error("Database fetch error:", ordersError);
            return NextResponse.json(
                { error: ordersError.message },
                { status: 500 }
            );
        }

        // --- LAZY EVALUATION FOR AUTO-CANCEL ---
        const now = new Date();
        const updatedOrders = [];

        for (const order of orders || []) {
            let currentStatus = order.status;
            
            // If the order is active but not picked up yet
            if (!['delivered', 'cancelled'].includes(currentStatus) && order.pickup_time) {
                try {
                    // Extract end time from "10:30 AM - 11:00 AM"
                    const parts = order.pickup_time.split(' - ');
                    if (parts.length === 2) {
                        const endTimeStr = parts[1].trim(); // "11:00 AM"
                        // Parse time to today's date
                        const timeMatch = endTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                        if (timeMatch) {
                            let hours = parseInt(timeMatch[1], 10);
                            const mins = parseInt(timeMatch[2], 10);
                            const modifier = timeMatch[3].toUpperCase();
                            if (modifier === 'PM' && hours < 12) hours += 12;
                            if (modifier === 'AM' && hours === 12) hours = 0;
                            
                            const slotEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, mins, 0);
                            
                            // Auto cancel if 1 hour has passed since the end of the slot
                            const oneHourAfterSlot = new Date(slotEndTime.getTime() + 60 * 60 * 1000);
                            
                            if (now > oneHourAfterSlot) {
                                // Auto-cancel this order
                                await supabase
                                    .from("orders")
                                    .update({ 
                                        status: 'cancelled',
                                        refund_eligible: false
                                    })
                                    .eq("id", order.id);
                                    
                                currentStatus = 'cancelled';
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error parsing pickup time for auto-cancel:", err);
                }
            }
            
            updatedOrders.push({ ...order, status: currentStatus });
        }

        return NextResponse.json({ orders: updatedOrders }, { status: 200 });
    } catch (e: any) {
        console.error("API route crash:", e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}