import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Implement getUserIdFromRequest in a shared utility file.
function getUserIdFromRequest(req: NextRequest): string | null {
    return "MOCKED_USER_ID"; 
}

/**
 * Clears the user's active cart by deleting all associated cart_items.
 */
export async function DELETE(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId || userId === "MOCKED_USER_ID") {
            return NextResponse.json({ error: 'Unauthorized: Session required.' }, { status: 401 });
        }

        // 1. Find the active cart ID
        const { data: cartData, error: cartError } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .limit(1)
            .single();

        if (cartError || !cartData) {
            // No active cart found, nothing to clear (or handle DB error)
            return NextResponse.json({ message: 'No active cart found to clear.' });
        }
        
        const cartId = cartData.id;

        // 2. Delete all items belonging to that cart
        const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartId);

        if (deleteError) {
            console.error("Error clearing cart items:", deleteError);
            throw deleteError;
        }

        return NextResponse.json({ message: 'Cart successfully cleared.' });

    } catch (error) {
        console.error('DELETE cart failed:', error);
        return NextResponse.json({ error: 'Internal server error clearing cart.' }, { status: 500 });
    }
}