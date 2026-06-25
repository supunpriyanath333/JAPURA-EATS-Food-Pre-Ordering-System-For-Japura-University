const https = require('https');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudmF3ZWx4dXJzdWZ1enZyZnpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4OTcwMSwiZXhwIjoyMDk3OTY1NzAxfQ.HWYLCDs4s7S9fMQ0iKNv1KpTsr_u8po2KLMKBmdVWi4';
const SUPABASE_HOST = 'fnvawelxursufuzvrfzn.supabase.co';

const CANTEENS = {
  c1: '6a0672cd-ee92-43f4-8e17-9e7f89809c94', // Open Canteen
  c2: '8ea21a57-f1a7-49df-9929-27aa9abfae6a', // Faculty of Science Canteen
  c3: '467b8f85-7bc8-4870-ac0f-8af6e9e1a75c', // Wala Canteen
};

const FOOD_ITEMS = [
  // Open Canteen - Breakfast
  { canteen_id: CANTEENS.c1, name: 'String Hoppers with Curry', description: 'Traditional red or white string hoppers served with dhal curry, pol sambol, and fish curry.', price: 150, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80', rating: 4.7 },
  { canteen_id: CANTEENS.c1, name: 'Pol Roti and Lunu Miris', description: 'Freshly made coconut flatbread served with spicy onion-chili paste.', price: 80, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80', rating: 4.4 },
  // Open Canteen - Lunch
  { canteen_id: CANTEENS.c1, name: 'Rice & Curry (Chicken)', description: 'Steaming hot rice served with chicken curry, three vegetable curries, and papadum.', price: 250, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', rating: 4.8 },
  { canteen_id: CANTEENS.c1, name: 'Rice & Curry (Egg)', description: 'White or red rice served with boiled egg curry and local vegetable sides.', price: 180, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', rating: 4.6 },
  // Open Canteen - Dinner
  { canteen_id: CANTEENS.c1, name: 'Chicken Kottu', description: 'Shredded flatbread stir-fried with vegetables, eggs, spices, and chicken curry.', price: 450, meal_type: 'dinner', available: true, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80', rating: 4.9 },
  { canteen_id: CANTEENS.c1, name: 'Vegetable Kottu', description: 'Spicy shredded roti stir-fried with fresh garden vegetables and egg.', price: 350, meal_type: 'dinner', available: true, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80', rating: 4.5 },

  // Science Canteen - Breakfast
  { canteen_id: CANTEENS.c2, name: 'Egg Hoppers', description: 'Crispy-edged bowl-shaped rice pancakes with an egg cooked in the center.', price: 120, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80', rating: 4.6 },
  { canteen_id: CANTEENS.c2, name: 'Milk Rice (Kiribath)', description: 'Traditional Sri Lankan milk rice served with coconut sambol and banana.', price: 100, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', rating: 4.5 },
  // Science Canteen - Lunch
  { canteen_id: CANTEENS.c2, name: 'Vegetable Fried Rice', description: 'Fluffy wok-fried basmati rice with fresh garden veggies and chili paste.', price: 350, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', rating: 4.5 },
  { canteen_id: CANTEENS.c2, name: 'Chicken Fried Rice', description: 'Fragrant fried rice with tender chicken pieces, vegetables, and special soy sauce.', price: 420, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', rating: 4.7 },
  // Science Canteen - Dinner
  { canteen_id: CANTEENS.c2, name: 'Cheese Kottu', description: 'Delicious kottu tossed in melted cheese and milk gravy for a rich, creamy flavor.', price: 550, meal_type: 'dinner', available: true, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80', rating: 4.8 },

  // Wala Canteen - Breakfast
  { canteen_id: CANTEENS.c3, name: 'Plain Tea & Bun', description: 'Fresh baked bun served with a warm cup of plain or milk tea.', price: 60, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80', rating: 4.3 },
  { canteen_id: CANTEENS.c3, name: 'Samosa (2 pcs)', description: 'Crispy golden pastry filled with spiced potatoes and vegetables.', price: 80, meal_type: 'breakfast', available: true, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', rating: 4.6 },
  // Wala Canteen - Lunch
  { canteen_id: CANTEENS.c3, name: 'Lentil Soup & Bread', description: 'Hearty and nutritious red lentil soup served with soft bread rolls.', price: 150, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80', rating: 4.7 },
  { canteen_id: CANTEENS.c3, name: 'Noodles with Egg', description: 'Stir-fried noodles with egg, vegetables, and a touch of chili sauce.', price: 200, meal_type: 'lunch', available: true, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80', rating: 4.4 },
  // Wala Canteen - Dinner
  { canteen_id: CANTEENS.c3, name: 'Short Eats Combo', description: 'Assorted short eats platter: fish buns, cutlets, and pastries.', price: 250, meal_type: 'dinner', available: true, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', rating: 4.8 },
];

// First delete the test item we inserted earlier
function deleteTestItem() {
  return new Promise((resolve) => {
    const req = https.request({
      method: 'DELETE',
      hostname: SUPABASE_HOST,
      path: '/rest/v1/food_items?name=eq.String%20Hoppers',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { console.log('Deleted test item, status:', r.statusCode); resolve(); });
    });
    req.end();
  });
}

function insertFoodItems(items) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(items);
    const req = https.request({
      method: 'POST',
      hostname: SUPABASE_HOST,
      path: '/rest/v1/food_items',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Prefer': 'return=representation'
      }
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        console.log(`Insert Status: ${r.statusCode}`);
        if (r.statusCode === 201) {
          const inserted = JSON.parse(d);
          console.log(`✅ Successfully inserted ${inserted.length} food items!`);
          inserted.forEach(item => console.log(` - [${item.meal_type}] ${item.name} (Rs. ${item.price})`));
        } else {
          console.log('❌ Error:', d);
        }
        resolve();
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🚀 Starting food items seed...\n');
  await deleteTestItem();
  await insertFoodItems(FOOD_ITEMS);
  console.log('\n✅ Done! Food items seeded successfully.');
}

main().catch(console.error);
