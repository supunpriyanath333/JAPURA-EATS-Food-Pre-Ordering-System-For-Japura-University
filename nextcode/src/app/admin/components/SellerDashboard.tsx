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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Tab Navigation */}
            <div 
                style={{ 
                    display: 'flex', 
                    backgroundColor: CARD_BG, 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                    padding: '0.25rem', 
                    maxWidth: '32rem', 
                    margin: '0 auto', 
                    border: `1px solid ${GRAY_BORDER}` 
                }}
            >
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        flex: 1, 
                        paddingTop: '0.75rem', 
                        paddingBottom: '0.75rem', 
                        fontWeight: 'bold', 
                        borderRadius: '0.5rem', 
                        transition: 'all 0.2s', 
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'orders' ? '#FEF2F2' : 'transparent', // Red 50
                        color: activeTab === 'orders' ? PRIMARY_TEXT : SECONDARY_TEXT,
                        boxShadow: activeTab === 'orders' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                    }}
                >
                    Order Management
                </button>
                <button
                    onClick={() => setActiveTab('food')}
                    style={{
                        flex: 1, 
                        paddingTop: '0.75rem', 
                        paddingBottom: '0.75rem', 
                        fontWeight: 'bold', 
                        borderRadius: '0.5rem', 
                        transition: 'all 0.2s', 
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'food' ? '#FEF2F2' : 'transparent', // Red 50
                        color: activeTab === 'food' ? PRIMARY_TEXT : SECONDARY_TEXT,
                        boxShadow: activeTab === 'food' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                    }}
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