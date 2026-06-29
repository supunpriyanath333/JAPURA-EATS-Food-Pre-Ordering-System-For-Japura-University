import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

function getEmailFromHeader(req: NextRequest): string | null {
    return req.headers.get("X-User-Email");
}

export async function POST(req: NextRequest) {
    try {
        const userEmail = getEmailFromHeader(req);
        if (!userEmail) {
            return NextResponse.json({ error: "Authorization failed" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
        }

        const supabase = supabaseServer();

        // Find user
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

        if (userError || !userData) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const userId = userData.id;

        // Fetch the order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("id, created_at, status, user_id, payment_method")
            .eq("id", orderId)
            .eq("user_id", userId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
        }

        // Rule 2: Cancellation not allowed if preparing or beyond (prepared)
        const nonCancellableStatuses = ['preparing', 'ready_for_pickup', 'delivered', 'cancelled'];
        if (nonCancellableStatuses.includes(order.status)) {
            return NextResponse.json({ error: "Order is already preparing or prepared and cannot be cancelled" }, { status: 400 });
        }

        // Refund is only for user-initiated cancellations AND if it's a card/online payment
        const isCardPayment = order.payment_method?.toLowerCase() === 'card' || order.payment_method?.toLowerCase() === 'online';

        // Update the order
        // Note: Assuming refund_eligible column has been added to the database by the user
        const { error: updateError } = await supabase
            .from("orders")
            .update({ 
                status: 'cancelled',
                refund_eligible: isCardPayment
            })
            .eq("id", orderId);

        if (updateError) {
            console.error("Cancellation update error:", updateError);
            return NextResponse.json({ error: `Database Error: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Order cancelled successfully (Refund Eligible)" }, { status: 200 });

    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
