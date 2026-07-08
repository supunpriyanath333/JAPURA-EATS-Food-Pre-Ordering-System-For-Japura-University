import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    const { name, location, phone, description, seller_email, imageUrl, rating, seller_password } = await req.json();
    const supabase = await supabaseServer();

    const { data, error } = await supabase.from('canteens').insert({
        name,
        location,
        phone,
        description,
        seller_email,
        imageUrl,
        rating,
        seller_password
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
}

export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.from('canteens').select('*').order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(req: NextRequest) {
    const { id, name, location, phone, description, seller_email, imageUrl, seller_password } = await req.json();
    
    if (!id) return NextResponse.json({ error: 'Canteen ID is required' }, { status: 400 });

    const supabase = await supabaseServer();
    
    const updateData: any = { name, location, phone, description, seller_email };
    if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
    }
    if (seller_password) {
        updateData.seller_password = seller_password;
    }

    const { data, error } = await supabase
        .from('canteens')
        .update(updateData)
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    
    if (!id) return NextResponse.json({ error: 'Canteen ID is required' }, { status: 400 });

    const supabase = await supabaseServer();

    const { error } = await supabase
        .from('canteens')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true }, { status: 200 });
}