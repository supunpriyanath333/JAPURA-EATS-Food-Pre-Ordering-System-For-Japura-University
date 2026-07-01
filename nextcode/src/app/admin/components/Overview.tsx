// src/app/admin/components/Overview.tsx
import React from 'react';

const Overview: React.FC = () => {
    const stats = [
        { label: 'Total Orders Today', value: '342', trend: '+12%', color: 'from-blue-500 to-blue-600' },
        { label: 'Monthly Revenue', value: 'LKR 450,000', trend: '+5%', color: 'from-green-500 to-green-600' },
        { label: 'Active Users', value: '1,205', trend: '+18%', color: 'from-purple-500 to-purple-600' },
        { label: 'Active Canteens', value: '8', trend: '0%', color: 'from-orange-500 to-orange-600' },
    ];

    const topCanteens = [
        { name: 'Central Mess Hall', orders: 156, percentage: 85 },
        { name: 'Science Faculty Canteen', orders: 98, percentage: 65 },
        { name: 'Management Faculty Cafe', orders: 64, percentage: 40 },
    ];

    return (
        <div className="!animate-fade-in-up">
            <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight !mb-8">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6 !mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="!bg-white !rounded-2xl !p-6 !shadow-sm !border !border-gray-100 !relative !overflow-hidden">
                        <div className={`!absolute !top-0 !right-0 !w-24 !h-24 !bg-gradient-to-br ${stat.color} !opacity-10 !rounded-bl-full !-mr-4 !-mt-4`}></div>
                        <p className="!text-sm !font-semibold !text-gray-500 !mb-1">{stat.label}</p>
                        <h3 className="!text-3xl !font-black !text-gray-900 !mb-2">{stat.value}</h3>
                        <div className="!flex !items-center !gap-1 !text-sm !font-bold !text-green-600">
                            <svg className="!w-4 !h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-8">
                {/* Top Canteens */}
                <div className="!bg-white !rounded-2xl !p-6 !shadow-sm !border !border-gray-100 lg:!col-span-2">
                    <h3 className="!text-lg !font-extrabold !text-gray-900 !mb-6">Top Performing Canteens</h3>
                    <div className="!space-y-6">
                        {topCanteens.map((canteen, idx) => (
                            <div key={idx}>
                                <div className="!flex !justify-between !text-sm !font-bold !mb-2">
                                    <span className="!text-gray-800">{canteen.name}</span>
                                    <span className="!text-gray-500">{canteen.orders} Orders</span>
                                </div>
                                <div className="!w-full !bg-gray-100 !rounded-full !h-2.5">
                                    <div className="!bg-[#B52222] !h-2.5 !rounded-full" style={{ width: `${canteen.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="!bg-gradient-to-br !from-[#B52222] !to-[#8a1919] !rounded-2xl !p-6 !shadow-lg !text-white !relative !overflow-hidden">
                    <div className="!absolute !top-0 !right-0 !w-32 !h-32 !bg-white !opacity-10 !rounded-full !-mr-10 !-mt-10"></div>
                    <div className="!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-white !opacity-10 !rounded-full !-ml-8 !-mb-8"></div>
                    
                    <h3 className="!text-lg !font-extrabold !mb-6 !relative !z-10">System Status</h3>
                    
                    <div className="!relative !z-10 !flex !flex-col !gap-4">
                        <div className="!flex !items-center !gap-3 !bg-white/10 !p-3 !rounded-xl !backdrop-blur-sm">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_10px_rgba(74,222,128,0.8)] !animate-pulse"></div>
                            <span className="!text-sm !font-bold">Ordering System Online</span>
                        </div>
                        <div className="!flex !items-center !gap-3 !bg-white/10 !p-3 !rounded-xl !backdrop-blur-sm">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                            <span className="!text-sm !font-bold">Database Connected</span>
                        </div>
                        <div className="!flex !items-center !gap-3 !bg-white/10 !p-3 !rounded-xl !backdrop-blur-sm">
                            <div className="!w-3 !h-3 !bg-green-400 !rounded-full !shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                            <span className="!text-sm !font-bold">Payment Gateway Active</span>
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
