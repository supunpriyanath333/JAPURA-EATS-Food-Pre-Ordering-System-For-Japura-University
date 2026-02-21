import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

/**
 * Updates the status of a specific order.
 */
export async function PATCH(
    req: NextRequest, 
    // Using a generic name for context to apply the await fix universally
    context: any 
) {
    try {
        // 🚨 CRITICAL FIX: Await the parameter access as demanded by the error message 
        // to handle its interpreted 'Promise' nature.
        const params = await context.params; 
        const orderId = params.orderId;
        
        // 1. Safety Check: Validate the extracted ID
        if (!orderId || typeof orderId !== 'string') {
            return NextResponse.json({ error: "Order ID is missing or invalid in the URL." }, { status: 400 });
        }

        // 2. Parse request body
        const { newStatus } = await req.json();

        // 3. Validation
        const validStatuses = ['pending', 'accepted', 'preparing', 'ready_for_pickup', 'delivered', 'cancelled'];
        if (!newStatus || !validStatuses.includes(newStatus)) {
            return NextResponse.json({ error: "Invalid or missing 'newStatus' in request body." }, { status: 400 });
        }

        // 4. Update the Order Status
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                status: newStatus, 
                updated_at: new Date().toISOString() 
            }) 
            .eq('id', orderId)
            .select('id, status')
            .single();

        if (error) {
            console.error("Database update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Status updated successfully.", order: data }, { status: 200 });

    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}