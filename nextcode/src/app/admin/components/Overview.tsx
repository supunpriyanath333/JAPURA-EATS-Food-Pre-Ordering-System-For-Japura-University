// src/app/admin/components/Overview.tsx
import React, { useState, useEffect } from 'react';
import AnalyticsDetails from './AnalyticsDetails';

const Overview: React.FC = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [totalOrdersToday, setTotalOrdersToday] = useState(0);
    const [orders, setOrders] = useState([]);
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/admin/api/analytics');
                const data = await res.json();
                if (res.ok) {
                    // Generate Dummy Data for Demonstration
                    const dummyCanteens = [
                        { id: 'c1', name: 'Science Faculty Canteen' },
                        { id: 'c2', name: 'Management Faculty Cafe' },
                        { id: 'c3', name: 'Central Mess Hall' }
                    ];
                    
                    const dummyOrders = [];
                    const statuses = ['accepted', 'processing', 'ready', 'picked_up', 'cancelled'];
                    const paymentMethods = ['Cash', 'Card'];
                    const diningOptions = ['Dine In', 'Takeaway'];
                    const timeSlots = ['12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '7:00 AM - 8:00 AM'];
                    const cancelReasons = ['by user', 'by System'];
                    const now = new Date();
                    
                    // Generate 1200 orders spread across 365 days
                    for (let i = 0; i < 1200; i++) {
                        const randomDaysAgo = Math.floor(Math.random() * 365);
                        const randomHour = Math.floor(Math.random() * 24);
                        const randomMinute = Math.floor(Math.random() * 60);
                        
                        const date = new Date(now);
                        date.setDate(date.getDate() - randomDaysAgo);
                        date.setHours(randomHour, randomMinute, 0, 0);
                        
                        const randomCanteen = dummyCanteens[Math.floor(Math.random() * dummyCanteens.length)];
                        const status = statuses[Math.floor(Math.random() * statuses.length)];
                        
                        dummyOrders.push({
                            id: `DUM-${i.toString().padStart(4, '0')}`,
                            user_id: `USR-${Math.floor(Math.random() * 900) + 100}`,
                            created_at: date.toISOString(),
                            status: status,
                            cancellation_reason: status === 'cancelled' ? cancelReasons[Math.floor(Math.random() * cancelReasons.length)] : null,
                            total_amount: Math.floor(Math.random() * 1500) + 150,
                            payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                            dining_option: diningOptions[Math.floor(Math.random() * diningOptions.length)],
                            pickup_time_slot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
                            canteen_id: randomCanteen.id,
                            canteen_name: randomCanteen.name,
                            items: ['Kottu', 'Iced Milo']
                        });
                    }
                    
                    setTotalOrdersToday(dummyOrders.filter(o => {
                        const oDate = new Date(o.created_at);
                        return oDate.toDateString() === now.toDateString();
                    }).length);
                    
                    setOrders(dummyOrders);
                    setCanteens(dummyCanteens);
                } else {
                    console.error("Error fetching analytics:", data.error);
                }
            } catch (error) {
                console.error("Network error fetching analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const stats = [
        { 
            id: 'orders',
            label: 'Total Orders Today', 
            value: loading ? '...' : totalOrdersToday.toString(), 
            trend: '+12%', 
            color: 'from-blue-500/20 to-blue-600/20', 
            iconColor: 'text-blue-500' 
        },
        { label: 'Monthly Revenue', value: 'LKR 450,000', trend: '+5%', color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-500' },
        { label: 'Active Users', value: '1,205', trend: '+18%', color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-500' },
        { label: 'Active Canteens', value: '8', trend: '0%', color: 'from-orange-500/20 to-orange-600/20', iconColor: 'text-orange-500' },
    ];

    const topCanteens = [
        { name: 'Central Mess Hall', orders: 156, percentage: 85 },
        { name: 'Science Faculty Canteen', orders: 98, percentage: 65 },
        { name: 'Management Faculty Cafe', orders: 64, percentage: 40 },
    ];

    if (showAnalytics) {
        return (
            <AnalyticsDetails 
                orders={orders} 
                canteens={canteens} 
                onBack={() => setShowAnalytics(false)} 
            />
        );
    }

    return (
        <div className="!animate-fade-in-up !relative">
            <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight !mb-8">Dashboard Overview</h2>
            
            {/* Stats Grid - Glassmorphism */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6 !mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !border !border-white/60 !relative !overflow-hidden !group hover:!shadow-[0_8px_30px_rgb(0,0,0,0.06)] !transition-all !duration-300">
                        <div className={`!absolute !top-0 !right-0 !w-32 !h-32 !bg-gradient-to-br ${stat.color} !rounded-bl-full !-mr-8 !-mt-8 !transition-transform !duration-500 group-hover:!scale-110`}></div>
                        
                        <div className="!flex !justify-between !items-start">
                            <p className="!text-sm !font-bold !text-gray-500 !mb-1 !relative !z-10 !uppercase !tracking-wider">{stat.label}</p>
                            {stat.id === 'orders' && (
                                <button 
                                    onClick={() => setShowAnalytics(true)}
                                    className="!relative !z-10 !text-[10px] !font-black !uppercase !tracking-wider !text-[#B52222] !bg-red-50 hover:!bg-red-100 !px-2 !py-1 !rounded-lg !transition-colors !border !border-red-100"
                                >
                                    Full Details
                                </button>
                            )}
                        </div>
                        
                        <h3 className="!text-4xl !font-black !text-gray-900 !mb-2 !relative !z-10">{stat.value}</h3>
                        <div className={`!flex !items-center !gap-1.5 !text-sm !font-black ${stat.iconColor} !relative !z-10`}>
                            <div className={`!p-1 !rounded-full !bg-white/50 !backdrop-blur-sm !border !border-white/80`}>
                                <svg className="!w-3.5 !h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-8">
                {/* Top Canteens - Glassmorphism */}
                <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-8 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !border !border-white/60 lg:!col-span-2 !flex !flex-col !justify-center">
                    <h3 className="!text-xl !font-black !text-gray-900 !mb-6 !flex !items-center !gap-2">
                        <svg className="!w-6 !h-6 !text-[#B52222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"></path></svg>
                        Top Performing Canteens
                    </h3>
                    <div className="!space-y-6">
                        {topCanteens.map((canteen, idx) => (
                            <div key={idx} className="!group">
                                <div className="!flex !justify-between !text-sm !font-bold !mb-2">
                                    <span className="!text-gray-800">{canteen.name}</span>
                                    <span className="!text-gray-500 !bg-white/50 !px-3 !py-0.5 !rounded-full !border !border-white/80">{canteen.orders} Orders</span>
                                </div>
                                <div className="!w-full !bg-white/50 !rounded-full !h-3 !border !border-white/80 !shadow-inner !overflow-hidden">
                                    <div className="!bg-[#B52222] !h-full !rounded-full !transition-all !duration-1000 !ease-out group-hover:!brightness-110" style={{ width: `${canteen.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health - Glassmorphism */}
                <div className="!bg-gradient-to-br !from-[#B52222]/90 !to-[#8a1919]/90 !backdrop-blur-xl !rounded-3xl !p-8 !shadow-[0_8px_30px_rgba(181,34,34,0.3)] !border !border-red-400/50 !text-white !relative !overflow-hidden">
                    <div className="!absolute !top-0 !right-0 !w-32 !h-32 !bg-white !opacity-10 !rounded-full !-mr-10 !-mt-10"></div>
                    <div className="!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-white !opacity-10 !rounded-full !-ml-8 !-mb-8"></div>
                    
                    <h3 className="!text-xl !font-black !mb-6 !relative !z-10 !flex !items-center !gap-2 !drop-shadow-md">
                        <svg className="!w-6 !h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        System Status
                    </h3>
                    
                    <div className="!relative !z-10 !flex !flex-col !gap-4">
                        <div className="!flex !items-center !gap-4 !bg-white/10 !p-4 !rounded-2xl !backdrop-blur-md !border !border-white/10 !transition-transform hover:!scale-105">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_12px_rgba(74,222,128,0.9)] !animate-pulse"></div>
                            <span className="!text-sm !font-black !tracking-wide">Ordering System Online</span>
                        </div>
                        <div className="!flex !items-center !gap-4 !bg-white/10 !p-4 !rounded-2xl !backdrop-blur-md !border !border-white/10 !transition-transform hover:!scale-105">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_12px_rgba(74,222,128,0.9)]"></div>
                            <span className="!text-sm !font-black !tracking-wide">Database Connected</span>
                        </div>
                        <div className="!flex !items-center !gap-4 !bg-white/10 !p-4 !rounded-2xl !backdrop-blur-md !border !border-white/10 !transition-transform hover:!scale-105">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_12px_rgba(74,222,128,0.9)]"></div>
                            <span className="!text-sm !font-black !tracking-wide">Payment Gateway Active</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
};

export default Overview;
