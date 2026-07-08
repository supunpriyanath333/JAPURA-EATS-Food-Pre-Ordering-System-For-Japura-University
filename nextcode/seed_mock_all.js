const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seedAll() {
    // Delete previous mock orders (ones with OTP = '1234', '5678', '9012')
    console.log("Cleaning up old mock orders...");
    await supabase.from('orders').delete().in('otp', ['1234', '5678', '9012']);

    const { data: canteens } = await supabase.from('canteens').select('id, name');
    const { data: users } = await supabase.from('users').select('id').limit(1);
    const userId = users[0].id;

    for (let canteen of canteens) {
        console.log(`Seeding orders for canteen: ${canteen.name}`);
        
        // Fetch a food item for this canteen
        const { data: foodItems } = await supabase.from('food_items').select('id, name').eq('canteen_id', canteen.id).limit(1);
        
        if (!foodItems || foodItems.length === 0) {
            console.log(`No food items found for canteen ${canteen.name}. Skipping...`);
            continue;
        }
        
        const foodItem = foodItems[0];

        const mockOrders = [
            {
                user_id: userId,
                canteen_id: canteen.id,
                total_amount: Math.floor(Math.random() * 1000) + 200,
                pickup_time: '12:30 PM',
                payment_method: 'Cash',
                status: 'accepted', // Maps to pending on frontend
                otp: '1234'
            },
            {
                user_id: userId,
                canteen_id: canteen.id,
                total_amount: Math.floor(Math.random() * 1000) + 200,
                pickup_time: '01:00 PM',
                payment_method: 'Card',
                status: 'preparing',
                otp: '5678'
            },
            {
                user_id: userId,
                canteen_id: canteen.id,
                total_amount: Math.floor(Math.random() * 1000) + 200,
                pickup_time: 'ASAP',
                payment_method: 'Cash',
                status: 'ready_for_pickup',
                otp: '9012'
            }
        ];

        for (let order of mockOrders) {
            const { data: newOrder, error } = await supabase.from('orders').insert([order]).select('id').single();
            if (error) {
                console.error("Error creating order:", error);
                continue;
            }

            const mockItems = [
                { order_id: newOrder.id, food_item_id: foodItem.id, name: foodItem.name, quantity: 2, price: order.total_amount },
            ];

            const { error: itemError } = await supabase.from('order_items').insert(mockItems);
            if (itemError) {
                console.error("Error inserting order item:", itemError);
            }
        }
        console.log(`Completed for ${canteen.name}`);
    }
}
seedAll();
