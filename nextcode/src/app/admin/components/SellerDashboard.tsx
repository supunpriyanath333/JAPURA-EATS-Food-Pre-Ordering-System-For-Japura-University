import { useState } from "react";
import { CARD_BG, GRAY_BORDER, PRIMARY_TEXT, SECONDARY_TEXT } from "../constants/colors";
import FoodItemManagement from "./FoodManagement";
import OrderManagement from "./OrderManagement";

interface SellerDashboardProps {
    canteenId: string;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ canteenId }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'food'>('orders');
    return (
        <div className="!animate-fade-in-up !relative !flex !flex-col !gap-8">
            {/* Tab Navigation - Glassmorphism */}
            <div className="!flex !bg-white/60 !backdrop-blur-xl !rounded-2xl !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !p-1.5 !max-w-2xl !mx-auto !border !border-white/60 !w-full">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`!flex-1 !py-3 !px-4 !font-black !rounded-xl !transition-all !duration-300 !text-sm md:!text-base !border ${
                        activeTab === 'orders' 
                            ? '!bg-gradient-to-r !from-[#B52222]/90 !to-[#8a1919]/90 !text-white !shadow-[0_4px_15px_rgba(181,34,34,0.2)] !border-red-400/30' 
                            : '!bg-transparent !text-gray-500 hover:!text-gray-700 hover:!bg-white/50 !border-transparent'
                    }`}
                >
                    Order Management
                </button>
                <button
                    onClick={() => setActiveTab('food')}
                    className={`!flex-1 !py-3 !px-4 !font-black !rounded-xl !transition-all !duration-300 !text-sm md:!text-base !border ${
                        activeTab === 'food' 
                            ? '!bg-gradient-to-r !from-[#B52222]/90 !to-[#8a1919]/90 !text-white !shadow-[0_4px_15px_rgba(181,34,34,0.2)] !border-red-400/30' 
                            : '!bg-transparent !text-gray-500 hover:!text-gray-700 hover:!bg-white/50 !border-transparent'
                    }`}
                >
                    Food Item Management
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1rem', borderRadius: '0.75rem' }}>
                {activeTab === 'orders' && <OrderManagement />}
                {activeTab === 'food' && <FoodItemManagement canteenId={canteenId} />}
            </div>
        </div>
    );
};

export default SellerDashboard;