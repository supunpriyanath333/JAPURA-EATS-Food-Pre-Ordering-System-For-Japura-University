import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

// --- Utility: Get User ID (Replace MOCK) ---
// IMPORTANT: You MUST implement getUserIdFromRequest in a shared utility file.
// For now, it remains a mock as per your request, but is flagged.
function getUserIdFromRequest(req: NextRequest): string | null {
    // ⚠️ TODO: Replace this MOCK implementation with your actual session/cookie logic.
    // e.g., using: req.headers.get('Cookie') to parse a signed session cookie.
    return "MOCKED_USER_ID"; 
}


// --- Types for Cart Modification ---

interface FoodItemRecord {
id: string;
price: number;
}

interface CartActionPayload {
food_item_id: string; 
action: 'add' | 'remove' | 'decrease'; // 'add' = +1, 'decrease' = -1, 'remove' = delete
}


// --- 1. GET: Fetch Cart Contents ---
/**
 * Fetches the user's active cart and its items.
 */
export async function GET(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId || userId === "MOCKED_USER_ID") {
            return NextResponse.json({ error: 'Unauthorized: Session required.' }, { status: 401 });
        }

        // Fetch the active cart for the user
        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select(`
                id,
                cart_items (
                    id,
                    food_item_id,
                    quantity,
                    price,
                    food_items (name, description, image_url, canteen_id)
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'active')
            .limit(1)
            .single();

        if (cartError && cartError.code !== 'PGRST116') {
            console.error("Error fetching cart:", cartError);
            return NextResponse.json({ error: 'Database error fetching cart.' }, { status: 500 });
        }
        
        // Return cart data (including items array, which may be empty)
        return NextResponse.json(cart);

    } catch (error) {
        console.error('GET cart failed:', error);
        return NextResponse.json({ error: 'Internal server error fetching cart.' }, { status: 500 });
    }
}


// --- 2. PATCH: Update Cart Contents (Add/Decrease/Remove) ---
/**
 * Handles all cart item updates (Add, Decrease, Remove)
 */
export async function PATCH(req: NextRequest) {
try {
// 1. Authentication and Authorization
const userId = getUserIdFromRequest(req);
if (!userId || userId === "MOCKED_USER_ID") {
return NextResponse.json({ error: 'Unauthorized: Session required.' }, { status: 401 });
}

const payload: CartActionPayload = await req.json();
const { food_item_id, action } = payload;

if (!food_item_id || !action) {
return NextResponse.json({ error: 'Missing required fields: food_item_id or action.' }, { status: 400 });
}

// --- 2. Find or Create the Active Cart ---
const { data: cartData, error: cartError } = await supabase
.from('carts')
.select('id')
.eq('user_id', userId)
.eq('status', 'active')
.limit(1)
.single();

let cartId: string;

if (cartError && cartError.code !== 'PGRST116') {
console.error("Error fetching cart:", cartError);
return NextResponse.json({ error: 'Database error fetching cart.' }, { status: 500 });
}

if (!cartData) {
// Cart not found, create a new one
const { data: newCartData, error: newCartError } = await supabase
.from('carts')
.insert({ user_id: userId, status: 'active' })
.select('id')
.single();

if (newCartError || !newCartData) {
console.error("Error creating new cart:", newCartError);
return NextResponse.json({ error: 'Failed to create new cart.' }, { status: 500 });
}
cartId = newCartData.id;
} else {
cartId = cartData.id;
}


// --- 3. Handle the specific cart action ---

// A. Remove Item (Trash Button) - Full Delete
if (action === 'remove') {
const { error } = await supabase
.from('cart_items')
.delete()
.eq('cart_id', cartId)
.eq('food_item_id', food_item_id);

if (error) throw error;
return NextResponse.json({ message: 'Item removed completely from cart.' });
}

// B. Find Existing Cart Item
const { data: existingItem, error: fetchItemError } = await supabase
.from('cart_items')
.select('id, quantity, price')
.eq('cart_id', cartId)
.eq('food_item_id', food_item_id)
.limit(1)
.single();

if (fetchItemError && fetchItemError.code !== 'PGRST116') {
console.error("Error fetching cart item:", fetchItemError);
return NextResponse.json({ error: 'Database error fetching cart item.' }, { status: 500 });
}


if (action === 'add') {
// Logic for Adding a new item OR Increasing quantity of existing item
if (existingItem) {
// Item exists: Increase quantity
const newQuantity = existingItem.quantity + 1;

const { data: updatedItem, error: updateError } = await supabase
.from('cart_items')
.update({ quantity: newQuantity, updated_at: new Date().toISOString() })
.eq('id', existingItem.id)
.select()
.single();

if (updateError) throw updateError;
return NextResponse.json({ message: 'Item quantity increased.', item: updatedItem });

} else {
// Item doesn't exist: Fetch current price and add new item
const { data: food, error: foodError } = await supabase
.from('food_items')
.select('price')
.eq('id', food_item_id)
.limit(1)
.single() as { data: FoodItemRecord | null, error: any };

if (foodError || !food) {
console.error("Error fetching food price:", foodError);
return NextResponse.json({ error: 'Food item not found or price missing.' }, { status: 404 });
}

const { data: newItem, error: insertError } = await supabase
.from('cart_items')
.insert({
cart_id: cartId,
food_item_id,
quantity: 1,
price: food.price, // Use price from food_items table (Best Practice)
})
.select()
.single();

if (insertError) throw insertError;
return NextResponse.json({ message: 'New item added to cart.', item: newItem });
}
} 

if (action === 'decrease') {
// Logic for Decreasing quantity or Deleting if quantity reaches zero
if (!existingItem) {
return NextResponse.json({ error: 'Item not found in cart to decrease.' }, { status: 404 });
}

const newQuantity = existingItem.quantity - 1;

if (newQuantity <= 0) {
// Quantity drops to 0 or less, so delete the item
const { error: deleteError } = await supabase
.from('cart_items')
.delete()
.eq('id', existingItem.id);

if (deleteError) throw deleteError;
return NextResponse.json({ message: 'Item removed from cart (quantity reached 0).' });

} else {
// Decrease quantity by 1
const { data: updatedItem, error: updateError } = await supabase
.from('cart_items')
.update({ quantity: newQuantity, updated_at: new Date().toISOString() })
.eq('id', existingItem.id)
.select()
.single();

if (updateError) throw updateError;
return NextResponse.json({ message: 'Item quantity decreased.', item: updatedItem });
}
} 

// If none of the above actions matched
return NextResponse.json({ error: 'Invalid cart action specified.' }, { status: 400 });

} catch (error) {
console.error('Cart operation failed:', error);
return NextResponse.json({ error: 'Internal server error during cart operation.' }, { status: 500 });
}
}