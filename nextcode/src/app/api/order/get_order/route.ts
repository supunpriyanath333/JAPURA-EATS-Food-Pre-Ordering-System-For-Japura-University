// api/order/get_order/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Using the standard Supabase client configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the Service Key for backend access
);

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
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select(`
                id,
                pickup_time,
                payment_method,
                total_amount,
                created_at,
                status, 
                order_items (
                    quantity,
                    name,
                    price,
                    food_item_id!inner(canteens(name)) 
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (ordersError) {
            console.error("Database fetch error:", ordersError);
            return NextResponse.json(
                { error: ordersError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ orders }, { status: 200 });
    } catch (e: any) {
        console.error("API route crash:", e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}