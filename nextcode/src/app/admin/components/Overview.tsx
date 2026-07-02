// src/app/admin/components/Overview.tsx
import React, { useState, useEffect } from 'react';
import AnalyticsDetails from './AnalyticsDetails';
import RevenueAnalytics from './RevenueAnalytics';
import UserAnalytics from './UserAnalytics';

const Overview: React.FC = () => {
    const [showAnalytics, setShowAnalytics] = useState<false | 'orders' | 'revenue' | 'users'>(false);
    const [totalOrdersToday, setTotalOrdersToday] = useState(0);
    const [totalRevenueToday, setTotalRevenueToday] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [canteens, setCanteens] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loginLogs, setLoginLogs] = useState<any[]>([]);
    const [activeUsersToday, setActiveUsersToday] = useState(0);
    const [ordersTrend, setOrdersTrend] = useState({ value: '', isPositive: true });
    const [revenueTrend, setRevenueTrend] = useState({ value: '', isPositive: true });
    const [usersTrend, setUsersTrend] = useState({ value: '', isPositive: true });
    const [top5Canteens, setTop5Canteens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
                        { id: 'c3', name: 'Central Mess Hall' },
                        { id: 'c4', name: 'Medical Faculty Canteen' },
                        { id: 'c5', name: 'Library Cafe' },
                        { id: 'c6', name: 'Sports Complex Cafe' }
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
                    
                    const todayOrders = dummyOrders.filter(o => {
                        const oDate = new Date(o.created_at);
                        return oDate.toDateString() === now.toDateString();
                    });
                    
                    const dummyUsers: any[] = [];
                    // Generate 1500 users registered over last 365 days
                    for (let i = 0; i < 1500; i++) {
                        const randomDaysAgo = Math.floor(Math.random() * 365);
                        const date = new Date(now);
                        date.setDate(date.getDate() - randomDaysAgo);
                        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
                        
                        dummyUsers.push({
                            id: `USR-${i + 100}`,
                            created_at: date.toISOString(),
                            role: 'student'
                        });
                    }

                    const dummyLoginLogs: any[] = [];
                    // Generate 5000 logins over last 30 days for these users
                    for (let i = 0; i < 5000; i++) {
                        const randomDaysAgo = Math.floor(Math.random() * 30);
                        const date = new Date(now);
                        date.setDate(date.getDate() - randomDaysAgo);
                        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
                        
                        dummyLoginLogs.push({
                            id: `LOG-${i}`,
                            user_id: dummyUsers[Math.floor(Math.random() * dummyUsers.length)].id,
                            login_time: date.toISOString(),
                        });
                    }

                    const todayLogins = dummyLoginLogs.filter(l => {
                        const lDate = new Date(l.login_time);
                        return lDate.toDateString() === now.toDateString();
                    });
                    
                    const uniqueActiveUsersToday = new Set(todayLogins.map(l => l.user_id)).size;

                    // Calculate Yesterday's Stats
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    const yesterdayOrders = dummyOrders.filter(o => {
                        const oDate = new Date(o.created_at);
                        return oDate.toDateString() === yesterday.toDateString();
                    });
                    
                    const yesterdayLogins = dummyLoginLogs.filter(l => {
                        const lDate = new Date(l.login_time);
                        return lDate.toDateString() === yesterday.toDateString();
                    });
                    
                    const yesterdayTotalOrders = yesterdayOrders.length;
                    const yesterdayTotalRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
                    const yesterdayActiveUsers = new Set(yesterdayLogins.map(l => l.user_id)).size;

                    const calculateTrend = (today: number, yesterday: number) => {
                        if (yesterday === 0) return { value: '+100%', isPositive: true };
                        if (today === 0 && yesterday > 0) return { value: '-100%', isPositive: false };
                        if (today === 0 && yesterday === 0) return { value: '0%', isPositive: true };
                        
                        const diff = today - yesterday;
                        const percentage = Math.round((diff / yesterday) * 100);
                        return { 
                            value: percentage > 0 ? `+${percentage}%` : `${percentage}%`, 
                            isPositive: percentage >= 0 
                        };
                    };

                    const tOrdersCount = todayOrders.length;
                    const tRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

                    setTotalOrdersToday(tOrdersCount);
                    setTotalRevenueToday(tRevenue);
                    setActiveUsersToday(uniqueActiveUsersToday);
                    
                    setOrdersTrend(calculateTrend(tOrdersCount, yesterdayTotalOrders));
                    setRevenueTrend(calculateTrend(tRevenue, yesterdayTotalRevenue));
                    setUsersTrend(calculateTrend(uniqueActiveUsersToday, yesterdayActiveUsers));
                    
                    // Calculate Top 5 Canteens Today
                    const canteenStats = dummyCanteens.map(canteen => {
                        const count = todayOrders.filter(o => o.canteen_id === canteen.id).length;
                        return { name: canteen.name, orders: count };
                    }).sort((a, b) => b.orders - a.orders).slice(0, 5);
                    
                    const maxOrders = Math.max(...canteenStats.map(c => c.orders), 1);
                    const formattedTop5 = canteenStats.map(c => ({
                        ...c,
                        percentage: Math.round((c.orders / maxOrders) * 100)
                    }));
                    setTop5Canteens(formattedTop5);
                    
                    setOrders(dummyOrders);
                    setCanteens(dummyCanteens);
                    setUsers(dummyUsers);
                    setLoginLogs(dummyLoginLogs);
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
            trend: loading ? '...' : ordersTrend.value,
            isPositive: ordersTrend.isPositive
        },
        { 
            id: 'revenue',
            label: 'Daily Revenue', 
            value: loading ? '...' : `LKR ${totalRevenueToday.toLocaleString()}`, 
            trend: loading ? '...' : revenueTrend.value,
            isPositive: revenueTrend.isPositive
        },
        { 
            id: 'users',
            label: 'Active Users Today', 
            value: loading ? '...' : activeUsersToday.toString(), 
            trend: loading ? '...' : usersTrend.value,
            isPositive: usersTrend.isPositive
        },
    ];

    // Legacy static array removed, using dynamic top5Canteens state

    if (showAnalytics === 'revenue') {
        return (
            <RevenueAnalytics 
                orders={orders} 
                canteens={canteens} 
                onBack={() => setShowAnalytics(false)} 
            />
        );
    }

    if (showAnalytics === 'orders') {
        return (
            <AnalyticsDetails 
                orders={orders} 
                canteens={canteens} 
                onBack={() => setShowAnalytics(false)} 
            />
        );
    }

    if (showAnalytics === 'users') {
        return <UserAnalytics users={users} loginLogs={loginLogs} onBack={() => setShowAnalytics(false)} />;
    }

    return (
        <div className="!animate-fade-in-up !relative">
            <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight !mb-8">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6 !mb-8">
                {/* Welcome Card */}
                <div className="!bg-gradient-to-br !from-[#B52222] !to-[#8a1919] !rounded-3xl !p-6 !shadow-[0_8px_30px_rgba(181,34,34,0.3)] !relative !overflow-hidden !group !transition-all !duration-300 hover:!shadow-[0_8px_30px_rgba(181,34,34,0.4)]">
                    <div className="!absolute !top-0 !right-0 !w-32 !h-32 !bg-white !opacity-10 !rounded-full !-mr-10 !-mt-10 !transition-transform !duration-500 group-hover:!scale-110"></div>
                    <div className="!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-white !opacity-10 !rounded-full !-ml-8 !-mb-8"></div>
                    
                    <div className="!relative !z-10 !flex !flex-col !h-full !justify-between">
                        <div>
                            <p className="!text-sm !font-bold !text-red-100 !mb-1 !uppercase !tracking-wider">Welcome Back,</p>
                            <h3 className="!text-3xl !font-black !text-white">Admin</h3>
                        </div>
                        <div className="!mt-4">
                            <p className="!text-red-100 !font-bold !text-xs !mb-0.5">{currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}</p>
                            <p className="!text-white !font-black !text-2xl !tracking-tight">{currentTime ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '--:--:--'}</p>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                {stats.map((stat, idx) => (
                    <div key={idx} className="!bg-gradient-to-b !from-white/60 !to-white/20 !backdrop-blur-2xl !rounded-3xl !p-6 !shadow-[0_8px_32px_rgba(0,0,0,0.05)] !border !border-white/60 !relative !overflow-hidden !group hover:!shadow-[0_8px_32px_rgba(181,34,34,0.1)] hover:!border-red-100/50 !transition-all !duration-500 !flex !flex-col !justify-between !h-full">
                        <div className={`!absolute !top-0 !right-0 !w-40 !h-40 !bg-gradient-to-br !from-[#B52222]/20 !to-transparent !rounded-bl-full !-mr-10 !-mt-10 !transition-transform !duration-700 group-hover:!scale-125 !pointer-events-none`}></div>
                        <div className={`!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-gradient-to-tr !from-gray-900/5 !to-transparent !rounded-tr-full !-ml-6 !-mb-6 !pointer-events-none`}></div>
                        
                        <div className="!relative !z-10 !mb-6">
                            <p className="!text-sm !font-bold !text-gray-600 !mb-3 !uppercase !tracking-wider">{stat.label}</p>
                            <h3 className="!text-4xl !font-black !text-black !tracking-tight">{stat.value}</h3>
                        </div>
                        
                        <div className="!flex !items-end !justify-between !w-full !relative !z-10 !mt-auto">
                            <div className={`!flex !items-center !gap-1.5 !text-sm !font-black ${stat.isPositive ? '!text-green-600' : '!text-[#B52222]'}`}>
                                <div className={`!p-1.5 !rounded-full !bg-white/80 !backdrop-blur-sm !border !border-white/80 !shadow-sm`}>
                                    {stat.isPositive ? (
                                        <svg className="!w-3.5 !h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                            <polyline points="17 6 23 6 23 12"></polyline>
                                        </svg>
                                    ) : (
                                        <svg className="!w-3.5 !h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                            <polyline points="17 18 23 18 23 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                {stat.trend}
                            </div>
                            {(stat.id === 'orders' || stat.id === 'revenue' || stat.id === 'users') && (
                                <button 
                                    onClick={() => setShowAnalytics(stat.id as 'orders' | 'revenue' | 'users')}
                                    className={`!text-[10px] !font-black !uppercase !tracking-wider !text-[#B52222] !bg-white hover:!bg-red-50 !px-3 !py-1.5 !rounded-lg !transition-all !border !border-white/50 !shadow-sm hover:!shadow`}
                                >
                                    Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-8">
                {/* Top Canteens - Glassmorphism Redesign */}
                <div className="!bg-gradient-to-b !from-white/60 !to-white/20 !backdrop-blur-2xl !rounded-3xl !p-8 !shadow-[0_8px_32px_rgba(0,0,0,0.05)] !border !border-white/60 lg:!col-span-2 !flex !flex-col !relative !overflow-hidden">
                    <div className={`!absolute !top-0 !right-0 !w-64 !h-64 !bg-gradient-to-bl !from-gray-100/50 !to-transparent !rounded-bl-full !-mr-10 !-mt-10 !pointer-events-none`}></div>
                    
                    <h3 className="!text-xl !font-black !text-black !mb-8 !flex !items-center !gap-2 !relative !z-10 !uppercase !tracking-wider">
                        <div className="!p-2 !bg-[#B52222]/10 !rounded-xl">
                            <svg className="!w-5 !h-5 !text-[#B52222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"></path></svg>
                        </div>
                        Top 5 Performing Canteens Today
                    </h3>
                    
                    <div className="!space-y-5 !relative !z-10 !flex-1 !flex !flex-col !justify-center">
                        {top5Canteens.map((canteen, idx) => (
                            <div key={idx} className="!group !flex !flex-col !gap-2">
                                <div className="!flex !items-center !justify-between">
                                    <div className="!flex !items-center !gap-3">
                                        <div className="!w-8 !h-8 !rounded-full !bg-white/80 !border !border-gray-200 !shadow-sm !flex !items-center !justify-center !text-sm !font-black !text-[#B52222]">
                                            {idx + 1}
                                        </div>
                                        <span className="!text-gray-900 !font-bold !text-sm">{canteen.name}</span>
                                    </div>
                                    <span className="!text-black !font-black !text-sm !bg-white/80 !px-3 !py-1 !rounded-lg !border !border-gray-100 !shadow-sm">{canteen.orders}</span>
                                </div>
                                <div className="!w-full !bg-gray-100/50 !rounded-full !h-2.5 !border !border-white/50 !shadow-inner !overflow-hidden !ml-11" style={{ width: 'calc(100% - 2.75rem)' }}>
                                    <div className="!bg-[#B52222] !h-full !rounded-full !transition-all !duration-1000 !ease-out group-hover:!brightness-110 !shadow-sm" style={{ width: `${canteen.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {top5Canteens.length === 0 && (
                            <div className="!text-center !text-gray-500 !font-bold !py-8">No orders yet today.</div>
                        )}
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
