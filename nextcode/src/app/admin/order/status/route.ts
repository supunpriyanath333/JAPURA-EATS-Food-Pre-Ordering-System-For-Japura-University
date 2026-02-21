import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  
    try {
      const token = req.headers.get("Authorization")?.replace("Bearer ", "");
      if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });
  
      const { data: { user } } = await supabase.auth.getUser(token);
  
      if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  
      // Check admin role
      if (user.user_metadata.role !== "admin") {
        return NextResponse.json({ error: "Not allowed" }, { status: 403 });
      }
  
      const { orderId, status } = await req.json();
  
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ data });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  