// --- Global Interfaces and Types for Japura Eats Admin Dashboard ---

/** Role Type */
export type UserRole = 'admin' | 'seller';

/** Food Meal Types */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/** Order Status Flow */
export type OrderStatus = 'accepted' | 'preparing' | 'ready' | 'picked_up';

/** Canteen Data Model */
export interface Canteen {
    id: string;
    name: string;
    location: string;
    phone: string;
    description: string;
    seller_email: string;
    imageUrl: string;
    rating: number;
}

/** Food Item Data Model */
export interface FoodItem {
    id: string;
    name: string;
    price: number; // Use number for currency
    available: boolean;
}

/** Grouped Food Items by Meal Type */
export interface FoodMenu {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    [key: string]: FoodItem[]; // Index signature for dynamic access
}

/** Order Data Model */
export interface Order {
    id: string;
    opt: string;
    status: OrderStatus;
    total: number; // Use number for currency
    items: string[];
    date: string;
    time: string;
    pickup_time: string;
    payment: 'Card' | 'Cash';
}

/** Interface for the Mock Supabase Response */


/** Interface for the Mock Router */
export interface Router {
    push: (path: string) => void;
}

/** Props for CanteenManagement */
export interface CanteenManagementProps {
    canteens: Canteen[];
    fetchCanteens: () => Promise<void>;
}

/** Props for SellerDashboard */
export interface SellerDashboardProps {
    canteenId: string;
}

/** Props for OrderCard */
export interface OrderCardProps {
    order: Order;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

/** Props for FoodItemManagement */
export interface FoodItemManagementProps {
    canteenId: string;
}