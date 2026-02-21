import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    const { name, location, phone, description, seller_email,imageUrl,rating } = await req.json();
    const supabase = supabaseServer();

    const { data, error } = await (await supabase).from('canteens').insert({
        name,
        location,
        phone,
        description,
        seller_email,
        imageUrl,
        rating
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
}

// New GET handler
export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.from('canteens').select('*').order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 200 });
}