import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();
    try {
        // 1. Fetch all orders
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // 2. Fetch order items to link orders to food items
        const { data: orderItems, error: orderItemsError } = await supabase
            .from("order_items")
            .select("order_id, food_item_id, name, quantity, price");

        if (orderItemsError) throw orderItemsError;

        // 3. Fetch food items to link food items to canteens
        const { data: foodItems, error: foodItemsError } = await supabase
            .from("food_items")
            .select("id, canteen_id");

        if (foodItemsError) throw foodItemsError;

        // 4. Fetch canteens to get the canteen name
        const { data: canteens, error: canteensError } = await supabase
            .from("canteens")
            .select("id, name");

        if (canteensError) throw canteensError;

        // Map food_items to canteen_id
        const foodItemToCanteen: Record<string, string> = {};
        foodItems.forEach(fi => {
            foodItemToCanteen[fi.id] = fi.canteen_id;
        });

        // Map canteen_id to canteen_name
        const canteenMap: Record<string, string> = {};
        canteens.forEach(c => {
            canteenMap[c.id] = c.name;
        });

        // Build the complete orders array
        const enrichedOrders = orders.map(order => {
            const itemsForOrder = orderItems.filter(oi => oi.order_id === order.id);
            
            // Find the canteen for this order (assuming all items in an order are from the same canteen)
            let canteenId = null;
            let canteenName = "Unknown Canteen";
            
            if (itemsForOrder.length > 0 && itemsForOrder[0].food_item_id) {
                canteenId = foodItemToCanteen[itemsForOrder[0].food_item_id];
                if (canteenId) {
                    canteenName = canteenMap[canteenId] || "Unknown Canteen";
                }
            }

            return {
                id: order.id,
                created_at: order.created_at,
                status: order.status,
                total_amount: order.total_amount,
                payment_method: order.payment_method,
                canteen_id: canteenId,
                canteen_name: canteenName,
                items: itemsForOrder.map(oi => `${oi.name} x ${oi.quantity}`)
            };
        });

        // Calculate 'Total Orders Today'
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const totalOrdersToday = enrichedOrders.filter(o => new Date(o.created_at) >= today).length;

        return NextResponse.json({
            totalOrdersToday,
            orders: enrichedOrders,
            canteens: canteens
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
