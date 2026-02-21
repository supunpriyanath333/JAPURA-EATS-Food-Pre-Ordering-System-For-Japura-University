import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = await supabaseServer();

    // Check canteens table for matching email + canteen name
    const { data: canteens, error } = await supabase
        .from('canteens')
        .select('*')
        .eq('seller_email', email)
        .eq('name', password)
        .limit(1);

    if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!canteens || canteens.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const canteen = canteens[0];

    // Return a “mock” profile object
    const profile = {
        role: 'seller',
        canteen_id: canteen.id,
        email: canteen.seller_email,
        name: canteen.name,
    };

    return NextResponse.json({
        user: { id: 'mock-user-' + canteen.id, email: canteen.seller_email },
        profile,
    });
}
