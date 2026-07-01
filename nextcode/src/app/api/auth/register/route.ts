
import { NextResponse } from "next/server";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { supabaseServer } from "@/lib/supabaseServer";

const supabase = supabaseServer();


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

    // Determine ID prefix based on role for the system_id
    let idPrefix = '';
    if (role === 'student') {
      idPrefix = 'ST';
    } else if (role === 'lecturer') {
      idPrefix = 'LC';
    } else if (role === 'staff') {
      idPrefix = 'SF';
    }

    // Auto-generate the custom system ID
    let newSystemId = `${idPrefix}1000`; // Default starting ID
    const { data: latestUser } = await supabase
      .from('users')
      .select('system_id')
      .ilike('system_id', `${idPrefix}%`)
      .order('system_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If we found a recent user with this prefix, increment their ID
    if (latestUser && latestUser.system_id) {
      const currentIdString = latestUser.system_id as string;
      const currentNumber = parseInt(currentIdString.replace(idPrefix, ''), 10);
      if (!isNaN(currentNumber)) {
        newSystemId = `${idPrefix}${currentNumber + 1}`;
      }
    }

    // Prepare the insertion payload
    // Note: The form now passes student_reg_no, lecture_id, etc. via ...body
    const insertPayload: any = { role, full_name, email, mobile, password_hash, ...body };
    delete insertPayload.password;
    
    // Assign the custom generated system ID
    insertPayload.system_id = newSystemId;

    // Insert user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "Failed to register user", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User registered successfully", system_id: newSystemId }, { status: 201 });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
