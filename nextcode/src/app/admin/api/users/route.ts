import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET all users
export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();

    // Select all users, excluding the password hash for security
    const { data, error } = await supabase
        .from('users')
        .select('id, system_id, full_name, email, mobile, role, student_reg_no, lecture_id, staff_id, faculty, position, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}

// DELETE a user
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        
        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const supabase = await supabaseServer();

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 });
    }
}
