"use client";
import { supabase } from '@/lib/supabaseClient'; // your supabase client
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RED_COLOR, CARD_BG, SECONDARY_TEXT, JAPURA_EATS_COLOR, MAIN_BG } from './constants/colors';
import CanteenManagement from './components/CanteenManagement';
import SellerDashboard from './components/SellerDashboard';

// Assuming '@/lib/supabase' provides these types and functions
// Since this is a standalone file for the immersive, I'll keep the types/imports minimal
// and assume they exist as context for the functional components.
interface Canteen { id: string; name: string; location: string; phone: string; description: string; seller_email: string; imageUrl: string; rating: number;}
interface FoodItem { id: string; name: string; price: number; available: boolean; }
type MealType = 'breakfast' | 'lunch' | 'dinner';
interface Order { id: string; opt: string; status: 'accepted' | 'preparing' | 'ready' | 'picked_up'; date: string; time: string; items: string[]; total: number; pickup_time: string; payment: string; }
// Mock supabase object and functions for UI testing
// export const supabase = {
//     from: (table: string) => ({
//         select: (query: any) => {
//             // Mock data structure
//             let data: any = [];
//             if (table === 'canteens') {
//                 data = [
//                     { id: 'c1', name: 'Central Mess Hall', location: 'Main Campus', phone: '123456', description: 'Authentic Sri Lankan Cuisine.', seller_email: 'seller1@japura.edu' },
//                     { id: 'c2', name: 'Faculty Cafe', location: 'FMS Building', phone: '654321', description: 'Coffee and short eats.', seller_email: 'seller2@japura.edu' },
//                     { id: 'c3', name: 'Faculty Cafe', location: 'FMS Building', phone: '654321', description: 'Coffee and short eats.', seller_email: 'seller2@japura.edu' },
//                 ];
//             } else if (table === 'food_items') {
//                 if (query.canteen_id === 'c1') {
//                      data = {
//                         breakfast: [
//                             { id: 'f1', name: 'Milk Rice', price: 150, available: true },
//                             { id: 'f2', name: 'String Hoppers', price: 120, available: false }
//                         ],
//                         lunch: [
//                             { id: 'f3', name: 'Chicken Kottu', price: 450, available: true },
//                             { id: 'f4', name: 'Veg Fried Rice', price: 350, available: true },
//                         ],
//                         dinner: []
//                     };
//                 }
//             } else if (table === 'orders') {
//                 if (query.canteen_id === 'c1') {
//                     data = [
//                         { id: 'o1', opt: '101', status: 'preparing', date: '2025-12-05', time: '12:30 PM', items: ['Chicken Kottu x 1'], total: 450, pickup_time: '1:00 PM', payment: 'Cash' },
//                         { id: 'o2', opt: '102', status: 'accepted', date: '2025-12-05', time: '12:45 PM', items: ['Veg Fried Rice x 2', 'Coca Cola x 1'], total: 750, pickup_time: '1:15 PM', payment: 'Card' },
//                         { id: 'o3', opt: '103', status: 'picked_up', date: '2025-12-05', time: '12:00 PM', items: ['Milk Rice x 1'], total: 150, pickup_time: '12:15 PM', payment: 'Cash' },
//                     ];
//                 }
//             }
//             return { data, error: null };
//         },
//         insert: (data: any) => ({ error: null, data: data }),
//         // Mock update function for Order Management
//         update: (data: any) => ({ error: null, data: data }),
//     }),
//     auth: {
//         signOut: () => console.log('Mock sign out'),
//     }
// };

const getSellerCanteenId = (email: string) => {
    // Mock linking logic
    if (email === 'seller1@japura.edu') return 'c1';
    if (email === 'seller2@japura.edu') return 'c2';
    return null;
};


const AdminDashboard: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'seller' | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [canteenId, setCanteenId] = useState<string | null>(null);
    const [canteens, setCanteens] = useState<Canteen[]>([]);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();

    // Fetch all canteens (admin only)
    const fetchCanteens = useCallback(async () => {
        try {
            const res = await fetch('/admin/api/canteens');
            const result = await res.json();

            if (!res.ok) {
                console.error('Failed to fetch canteens:', result.error);
                setCanteens([]);
            } else {
                setCanteens(result.data || []);
            }
        } catch (err) {
            console.error(err);
            setCanteens([]);
        }
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem('admin_user_role') as 'admin' | 'seller' | null;
        const storedEmail = localStorage.getItem('admin_user_email');
        const storedCanteenId = localStorage.getItem('canteen_id');

        if (!storedRole || !storedEmail) {
            setRedirecting(true);
            router.push('/admin/login');
            return;
        }

        setRole(storedRole);
        setEmail(storedEmail);

        if (storedRole === 'admin') {
            fetchCanteens().finally(() => setLoading(false));
        } else if (storedRole === 'seller') {
            if (!storedCanteenId) {
                setRedirecting(true);
                router.push('/admin/login');
                return;
            }
            setCanteenId(storedCanteenId);
            setLoading(false);
        }
    }, [router, fetchCanteens]);

    const handleLogout = async () => {
        localStorage.removeItem('admin_user_role');
        localStorage.removeItem('admin_user_email');
        localStorage.removeItem('canteen_id');

        await supabase.auth.signOut();

        setTimeout(() => {
            router.replace('/admin/login');
        }, 100);
    };

    if (loading || redirecting) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '500', color: '#4B5563', backgroundColor: MAIN_BG }}>
                Loading Dashboard...
            </div>
        );
    }

    if (!role) return null; // Safety

    return (
        <div style={{ minHeight: '100vh', backgroundColor: MAIN_BG, fontFamily: 'Inter, sans-serif' }}>
            {/* Navbar */}
            <nav style={{ backgroundColor: CARD_BG, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 20 }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: JAPURA_EATS_COLOR }}>
                        JAPURA EATS <span style={{ color: SECONDARY_TEXT, fontSize: '1rem', fontWeight: '600' }}>| Admin Panel</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'none', textAlign: 'right', flexDirection: 'column', gap: '0.125rem' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4B5563' }}>{email}</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: RED_COLOR }}>{role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                color: CARD_BG,
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                transition: 'opacity 0.3s',
                                backgroundColor: RED_COLOR,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
                            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
                {role === 'admin' && <CanteenManagement canteens={canteens} fetchCanteens={fetchCanteens} />}
                {role === 'seller' && canteenId && <SellerDashboard canteenId={canteenId} />}
                {role === 'seller' && !canteenId && (
                    <div style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#B91C1C', padding: '1.5rem', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Configuration Error</h4>
                        <p style={{ fontSize: '1.125rem' }}>Your account is logged in but not linked to a specific canteen. Contact the main administrator.</p>
                    </div>
                )}
            </main>
        </div>
    );
};


export default AdminDashboard;