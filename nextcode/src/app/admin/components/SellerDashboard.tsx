import { useState } from "react";
import FoodItemManagement from "./FoodManagement";
import OrderManagement from "./OrderManagement";
import OrderRequests from "./OrderRequests";

interface SellerDashboardProps {
    canteenId: string;
    email: string | null;
    onLogout: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ canteenId, email, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'requests' | 'orders' | 'food'>('requests');

    const tabs = [
        { id: 'requests', label: 'New Requests', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></> },
        { id: 'orders', label: 'Order Management', icon: <><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></> },
        { id: 'food', label: 'Food Menu', icon: <><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></> },
    ];

    return (
        <div className="!h-screen !bg-[#f8f9fc] !font-sans !flex !relative !overflow-hidden !w-full">
            {/* Decorative background blobs to make glassmorphism pop */}
            <div className="!absolute !top-[-10%] !left-[-10%] !w-[50vw] !h-[50vw] !bg-red-200/40 !rounded-full !blur-[120px] !pointer-events-none !z-0"></div>
            <div className="!absolute !bottom-[-10%] !right-[-5%] !w-[40vw] !h-[40vw] !bg-blue-200/40 !rounded-full !blur-[120px] !pointer-events-none !z-0"></div>
            <div className="!absolute !top-[30%] !right-[15%] !w-[30vw] !h-[30vw] !bg-yellow-200/20 !rounded-full !blur-[100px] !pointer-events-none !z-0"></div>

            {/* Sidebar - Yellow Mixed Premium Glassmorphism Background Only */}
            <div className="!w-[280px] !bg-gradient-to-b !from-yellow-50/70 !via-yellow-100/50 !to-yellow-50/60 !backdrop-blur-3xl !border-r !border-white/70 !shadow-[4px_0_40px_rgba(234,179,8,0.2)] !flex !flex-col !h-screen !relative !z-20">
                <div className="!absolute !top-0 !left-0 !w-full !h-full !bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] !opacity-[0.03] !pointer-events-none"></div>

                <div className="!pt-8 !px-8 !pb-4 !relative !z-10">
                    <h1 className="!text-2xl !font-extrabold !text-[#B52222] !tracking-tight">
                        JAPURA EATS
                    </h1>
                    <p className="!text-xs !font-bold !text-gray-600 !uppercase !tracking-wider !mt-1 !mb-6">Canteen Portal</p>
                    <div className="!w-full !h-[2px] !bg-gradient-to-r !from-[#B52222]/60 !to-transparent !rounded-full"></div>
                </div>

                <div className="!flex-1 !overflow-y-auto !py-6 !px-4 !relative !z-10 !custom-scrollbar">
                    <nav className="!space-y-2">
                        {tabs.map(tab => (
                            <button key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`!cursor-pointer !w-full !flex !items-center !gap-3 !px-4 !py-3.5 !text-sm !font-black !rounded-2xl !transition-all !duration-300 !group ${activeTab === tab.id
                                        ? '!bg-gradient-to-r !from-white/90 !to-white/70 !backdrop-blur-xl !text-[#B52222] !shadow-[0_8px_25px_rgba(181,34,34,0.12)] !border !border-white !scale-[1.02]'
                                        : '!text-gray-800 hover:!bg-white/50 hover:!backdrop-blur-md hover:!text-black !border !border-transparent hover:!border-white/60 hover:!shadow-sm'
                                    }`}
                            >
                                <div className={`!p-2 !rounded-xl !transition-colors !duration-300 ${activeTab === tab.id ? '!bg-red-100 !text-[#B52222]' : '!bg-white/60 !text-gray-600 group-hover:!bg-white group-hover:!text-gray-900'}`}>
                                    <svg className="!w-5 !h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        {tab.icon}
                                    </svg>
                                </div>
                                <span className="!tracking-wide">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="!px-6 !pt-6 !pb-6 !relative !z-10 !bg-white/30">
                    <div className="!flex !items-center !gap-3 !mb-4 !p-3 !bg-white/70 !rounded-2xl !border !border-white/80 !shadow-sm">
                        <div className="!w-10 !h-10 !rounded-xl !bg-red-100 !flex !items-center !justify-center !text-[#B52222] !font-black !shadow-inner">
                            {email?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="!flex-1 !min-w-0">
                            <p className="!text-sm !font-black !text-gray-900 !truncate">{email}</p>
                            <p className="!text-[10px] !font-black !text-gray-600 !uppercase !tracking-widest !mt-0.5">Seller</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="!cursor-pointer !w-full !flex !items-center !justify-center !gap-2 !px-4 !py-3 !text-sm !font-black !text-white !bg-[#B52222] hover:!bg-[#901b1b] !border !border-transparent !rounded-2xl !transition-all !duration-300 !shadow-md hover:!shadow-lg"
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
                    <div className="!animate-fade-in-up">
                        {activeTab === 'requests' && <OrderRequests canteenId={canteenId} />}
                        {activeTab === 'orders' && <OrderManagement />}
                        {activeTab === 'food' && <FoodItemManagement canteenId={canteenId} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;