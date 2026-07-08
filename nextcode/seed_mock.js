const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seed() {
    const { data: canteens } = await supabase.from('canteens').select('id, name').limit(1);
    const canteenId = canteens[0].id;
    const { data: users } = await supabase.from('users').select('id, email').limit(1);
    const userId = users[0].id;

    const mockOrders = [
        {
            user_id: userId,
            canteen_id: canteenId,
            total_amount: 850,
            pickup_time: '12:30 PM',
            payment_method: 'Cash',
            status: 'accepted', // We use accepted since pending is invalid
            otp: '1234'
        },
        {
            user_id: userId,
            canteen_id: canteenId,
            total_amount: 1200,
            pickup_time: '01:00 PM',
            payment_method: 'Card',
            status: 'preparing',
            otp: '5678'
        },
        {
            user_id: userId,
            canteen_id: canteenId,
            total_amount: 450,
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

        const orderId = newOrder.id;
        
        const mockItems = [
            { order_id: orderId, name: 'Chicken Kottu', quantity: 1, price: 850 },
            { order_id: orderId, name: 'Coca Cola', quantity: 1, price: 150 }
        ];

        await supabase.from('order_items').insert(mockItems);
        console.log(`Successfully created mock order ${orderId} with status ${order.status}`);
    }
}
seed();
