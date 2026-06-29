import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { user_id, pickup_time, payment_method, dining_option, client_total, cart_items } = body;

    if (!user_id || !pickup_time || !payment_method || !client_total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Capitalize payment_method to satisfy DB check constraint ('cash' -> 'Cash', 'card' -> 'Card')
    const db_payment_method = payment_method.charAt(0).toUpperCase() + payment_method.slice(1).toLowerCase();

    const supabase = supabaseServer();

    // 1️⃣ Create order
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        pickup_time,
        payment_method: db_payment_method,
        total_amount: client_total,
        otp
      })
      .select()
      .single();

    if (orderError) {
      console.error(orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 2️⃣ Insert order items
    if (cart_items && Array.isArray(cart_items)) {
      const formattedItems = cart_items.map((item) => ({
        order_id: order.id,
        food_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(formattedItems);

      if (itemError) {
        console.error(itemError);
        return NextResponse.json({ error: itemError.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { message: "Order placed!", orderId: order.id, total: client_total },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
