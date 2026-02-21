
import { NextResponse } from "next/server";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);


const scrypt = promisify(_scrypt);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, full_name, email, mobile, password } = body;

    // Validate input
    if (!role || !full_name || !email || !mobile || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!["student", "lecturer", "staff"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Generate salt and hash password
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const password_hash = `${salt}:${derivedKey.toString("hex")}`;

    // Insert user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ role, full_name, email, mobile, password_hash }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error); // <--- log the exact error
      return NextResponse.json(
        { message: "Failed to register user", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
