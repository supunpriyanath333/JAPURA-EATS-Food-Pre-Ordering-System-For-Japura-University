import { NextResponse } from "next/server";
import { scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const scrypt = promisify(_scrypt);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    // Fetch user from Supabase using service role
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Split stored password into salt and hash
    const [salt, key] = user.password_hash.split(":");

    // Hash the entered password with the same salt
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    if (key !== derivedKey.toString("hex")) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Authentication successful
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}