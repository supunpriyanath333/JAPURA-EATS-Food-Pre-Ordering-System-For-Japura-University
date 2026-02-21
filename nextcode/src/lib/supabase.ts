// --- Interface Definitions ---
export interface Canteen {
    id: string;
    name: string;
    location: string;
    phone: string;
    seller_email: string;
    description: string;
}

export interface FoodItem {
    id: number;
    name: string;
    price: number;
    available: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Order {
    id: string;
    date: string;
    time: string;
    status: 'accepted' | 'preparing' | 'ready' | 'picked_up';
    total: number;
    opt: number;
    items: string[];
    pickup_time: string;
    payment: 'Online' | 'Cash';
}

export interface Profile {
    role: 'admin' | 'seller';
    canteen_id: string | null;
}

// --- Mock Data ---
const MOCK_CANTEEN_DATA: Canteen[] = [
    { id: 'c1', name: 'Open Canteen', location: 'Faculty of Management', phone: '077-123-4567', seller_email: 'seller1@japura.edu', description: 'Serving authentic Sri Lankan Cuisine.' },
];

const MOCK_FOOD_DATA: { [key: string]: { [key in MealType]: FoodItem[] } } = {
    'c1': {
        breakfast: [{ id: 1, name: 'String Hoppers', price: 150, available: true }],
        lunch: [{ id: 2, name: 'Rice & Curry', price: 250, available: true }],
        dinner: [{ id: 3, name: 'Kottu', price: 400, available: true }],
    }
};

const MOCK_ORDERS_DATA: { [key: string]: Order[] } = {
    'c1': [
        { id: 'OP00123', date: '03/11/2025', time: '08:24 AM', status: 'accepted', total: 150, opt: 1078, items: ['1 x String Hoppers with Curry'], pickup_time: '12:00 PM - 12:15 PM', payment: 'Online' },
        { id: 'OP00124', date: '03/11/2025', time: '09:00 AM', status: 'preparing', total: 300, opt: 1079, items: ['2 x Rice & Curry'], pickup_time: '01:00 PM - 01:15 PM', payment: 'Cash' },
    ]
};

const MOCK_USER_PROFILES: { [key: string]: Profile } = {
    'admin@japura.edu': { role: 'admin', canteen_id: null },
    'seller1@japura.edu': { role: 'seller', canteen_id: 'c1' },
};

export const supabase = {
    // Mock Auth functions
    auth: {
        signInWithPassword: async (credentials: { email: string; password?: string }) => {
            const { email } = credentials;
            const profile = MOCK_USER_PROFILES[email];
            if (profile) {
                // Return a mock user object with the profile attached for easy testing
                return { 
                    user: { id: 'mock-id-' + profile.role, email: email }, 
                    error: null, 
                    profile: MOCK_USER_PROFILES[email] 
                };
            }
            return { user: null, error: { message: 'Invalid credentials or user not found' }, profile: null };
        },
        signOut: async () => {
            // Mock sign out
        }
    },

    // Mock Database functions
    from: (table: string) => ({
        select: async (query?: { canteen_id?: string } | string) => {
            if (table === 'profiles') {
                // Simple mock for profile fetch by email
                if (typeof query === 'string' && query.includes('.eq')) {
                    const email = query.split('.eq')[1].slice(2, -1);
                    const data = MOCK_USER_PROFILES[email] ? [MOCK_USER_PROFILES[email]] : [];
                    return { data, error: null };
                }
            }
            if (table === 'canteens') {
                return { data: MOCK_CANTEEN_DATA, error: null };
            }
            if (table === 'food_items') {
                // Simplified query for food items by canteen_id
                if (typeof query === 'object' && query.canteen_id) {
                    // Return all items grouped by meal type for the seller dashboard structure
                    return { data: MOCK_FOOD_DATA[query.canteen_id] || {}, error: null };
                }
            }
            if (table === 'orders') {
                // Simplified query for orders by canteen_id
                if (typeof query === 'object' && query.canteen_id) {
                    return { data: MOCK_ORDERS_DATA[query.canteen_id] || [], error: null };
                }
            }
            return { data: [], error: null };
        },
        insert: async (data: any) => {
            if (table === 'canteens') {
                // Mock adding a new canteen
                const newCanteen = {...data, id: 'c' + (MOCK_CANTEEN_DATA.length + 1)} as Canteen;
                MOCK_CANTEEN_DATA.push(newCanteen);
                // Also mock updating the seller's profile to link the new canteen, if seller_email is provided
                const profile = MOCK_USER_PROFILES[data.seller_email];
                if(profile) {
                    profile.canteen_id = newCanteen.id;
                }
            }
            // Mock data structure requires returning an array, even if empty
            return { data: [], error: null };
        },
        update: async (data: any) => ({ data: [], error: null }),
    }),
};

// Function to fetch the seller's canteen ID after login
export const getSellerCanteenId = (email: string): string | null => {
    const profile = MOCK_USER_PROFILES[email];
    return profile ? profile.canteen_id : null;
};