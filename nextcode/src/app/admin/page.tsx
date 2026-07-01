"use client";
import { supabase } from '@/lib/supabaseClient';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RED_COLOR, CARD_BG, SECONDARY_TEXT, JAPURA_EATS_COLOR, MAIN_BG } from './constants/colors';

// Import our Dashboard Components
import CanteenManagement from './components/CanteenManagement';
import SellerDashboard from './components/SellerDashboard';
import Overview from './components/Overview';
import UserManagement from './components/UserManagement';
import FeedbackManagement from './components/FeedbackManagement';
import SystemSettings from './components/SystemSettings';

interface Canteen { id: string; name: string; location: string; phone: string; description: string; seller_email: string; imageUrl: string; rating: number;}

const AdminDashboard: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'seller' | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [canteenId, setCanteenId] = useState<string | null>(null);
    const [canteens, setCanteens] = useState<Canteen[]>([]);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    
    // Root Admin Navigation State
    const [activeTab, setActiveTab] = useState<'overview' | 'canteens' | 'users' | 'feedback' | 'settings'>('overview');
    
    const router = useRouter();

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
            <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-50 !font-sans">
                <div className="!animate-pulse !text-xl !font-semibold !text-gray-500">Loading Dashboard...</div>
            </div>
        );
    }

    if (!role) return null;

    // ----- ROOT ADMIN VIEW -----
    if (role === 'admin') {
        const tabs = [
            { id: 'overview', label: 'Overview', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> },
            { id: 'canteens', label: 'Canteen Management', icon: <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"></path> },
            { id: 'users', label: 'User Management', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></> },
            { id: 'feedback', label: 'Feedback & Ratings', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon> },
            { id: 'settings', label: 'System Settings', icon: <><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></> }
        ];

        return (
            <div className="!min-h-screen !bg-[#f8f9fc] !font-sans !flex !relative !overflow-hidden">
                {/* Decorative background blobs to make glassmorphism pop */}
                <div className="!absolute !top-[-10%] !left-[-10%] !w-[50vw] !h-[50vw] !bg-red-200/40 !rounded-full !blur-[120px] !pointer-events-none !z-0"></div>
                <div className="!absolute !bottom-[-10%] !right-[-5%] !w-[40vw] !h-[40vw] !bg-blue-200/40 !rounded-full !blur-[120px] !pointer-events-none !z-0"></div>
                <div className="!absolute !top-[30%] !right-[15%] !w-[30vw] !h-[30vw] !bg-yellow-200/20 !rounded-full !blur-[100px] !pointer-events-none !z-0"></div>
                
                {/* Sidebar */}
                <div className="!w-64 !bg-white !border-r !border-gray-200 !shadow-sm !flex !flex-col !sticky !top-0 !h-screen">
                    <div className="!p-6 !border-b !border-gray-100">
                        <h1 className="!text-2xl !font-extrabold !text-[#B52222] !tracking-tight">
                            JAPURA EATS
                        </h1>
                        <p className="!text-xs !font-bold !text-gray-400 !uppercase !tracking-wider !mt-1">Admin Portal</p>
                    </div>
                    
                    <div className="!flex-1 !overflow-y-auto !py-4">
                        <nav className="!px-3 !space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`!w-full !flex !items-center !gap-3 !px-3 !py-2.5 !text-sm !font-semibold !rounded-xl !transition-all !cursor-pointer ${
                                        activeTab === tab.id 
                                        ? '!bg-red-50 !text-[#B52222]' 
                                        : '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900'
                                    }`}
                                >
                                    <svg className={`!w-5 !h-5 ${activeTab === tab.id ? '!text-[#B52222]' : '!text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {tab.icon}
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="!p-4 !border-t !border-gray-100">
                        <div className="!flex !items-center !gap-3 !px-3 !py-2 !mb-2">
                            <div className="!w-8 !h-8 !rounded-full !bg-red-100 !flex !items-center !justify-center !text-[#B52222] !font-bold">A</div>
                            <div className="!flex-1 !min-w-0">
                                <p className="!text-sm !font-bold !text-gray-900 !truncate">{email}</p>
                                <p className="!text-xs !text-gray-500">Root Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="!w-full !flex !items-center !justify-center !gap-2 !px-4 !py-2 !text-sm !font-bold !text-red-700 !bg-red-50 hover:!bg-red-100 !rounded-xl !transition-colors !cursor-pointer"
                        >
                            <svg className="!w-4 !h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="!flex-1 !overflow-y-auto !bg-transparent !relative !z-10">
                    <main className="!max-w-7xl !mx-auto !p-8">
                        {activeTab === 'overview' && <Overview />}
                        {activeTab === 'canteens' && <CanteenManagement canteens={canteens} fetchCanteens={fetchCanteens} />}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'feedback' && <FeedbackManagement />}
                        {activeTab === 'settings' && <SystemSettings />}
                    </main>
                </div>
            </div>
        );
    }

    // ----- SELLER VIEW -----
    return (
        <div style={{ minHeight: '100vh', backgroundColor: MAIN_BG, fontFamily: 'Inter, sans-serif' }}>
            <nav style={{ backgroundColor: CARD_BG, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 20 }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: JAPURA_EATS_COLOR }}>
                        JAPURA EATS <span style={{ color: SECONDARY_TEXT, fontSize: '1rem', fontWeight: '600' }}>| Canteen Portal</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'none', textAlign: 'right', flexDirection: 'column', gap: '0.125rem' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4B5563' }}>{email}</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: RED_COLOR }}>Seller</p>
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
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
                {canteenId ? <SellerDashboard canteenId={canteenId} /> : (
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