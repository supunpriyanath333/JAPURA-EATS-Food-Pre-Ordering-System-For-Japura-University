export const supabase = {
    from: (table: string) => ({
        select: (query: any) => {
            // Mock data structure
            let data: any = [];
            if (table === 'canteens') {
                data = [
                    { id: 'c1', name: 'Central Mess Hall', location: 'Main Campus', phone: '123456', description: 'Authentic Sri Lankan Cuisine.', seller_email: 'seller1@japura.edu' },
                    { id: 'c2', name: 'Faculty Cafe', location: 'FMS Building', phone: '654321', description: 'Coffee and short eats.', seller_email: 'seller2@japura.edu' },
                    { id: 'c3', name: 'Faculty Cafe', location: 'FMS Building', phone: '654321', description: 'Coffee and short eats.', seller_email: 'seller2@japura.edu' },
                ];
            } else if (table === 'food_items') {
                if (query.canteen_id === 'c1') {
                     data = {
                        breakfast: [
                            { id: 'f1', name: 'Milk Rice', price: 150, available: true },
                            { id: 'f2', name: 'String Hoppers', price: 120, available: false }
                        ],
                        lunch: [
                            { id: 'f3', name: 'Chicken Kottu', price: 450, available: true },
                            { id: 'f4', name: 'Veg Fried Rice', price: 350, available: true },
                        ],
                        dinner: []
                    };
                }
            } else if (table === 'orders') {
                if (query.canteen_id === 'c1') {
                    data = [
                        { id: 'o1', opt: '101', status: 'preparing', date: '2025-12-05', time: '12:30 PM', items: ['Chicken Kottu x 1'], total: 450, pickup_time: '1:00 PM', payment: 'Cash' },
                        { id: 'o2', opt: '102', status: 'accepted', date: '2025-12-05', time: '12:45 PM', items: ['Veg Fried Rice x 2', 'Coca Cola x 1'], total: 750, pickup_time: '1:15 PM', payment: 'Card' },
                        { id: 'o3', opt: '103', status: 'picked_up', date: '2025-12-05', time: '12:00 PM', items: ['Milk Rice x 1'], total: 150, pickup_time: '12:15 PM', payment: 'Cash' },
                    ];
                }
            }
            return { data, error: null };
        },
        insert: (data: any) => ({ error: null, data: data }),
        // Mock update function for Order Management
        update: (data: any) => ({ error: null, data: data }),
    }),
    auth: {
        signOut: () => console.log('Mock sign out'),
    }
};