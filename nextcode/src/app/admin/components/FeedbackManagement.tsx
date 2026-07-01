// src/app/admin/components/FeedbackManagement.tsx
import React, { useState } from 'react';

const FeedbackManagement: React.FC = () => {
    const [reviews] = useState([
        { id: 1, student: 'Kamal Perera', studentId: 'ST1005', canteen: 'Central Mess Hall', item: 'Chicken Kottu', rating: 5, date: 'Today, 2:30 PM' },
        { id: 2, student: 'Amali Fernando', studentId: 'ST1021', canteen: 'Science Faculty Canteen', item: 'Vegetable Rice', rating: 3, date: 'Today, 1:15 PM' },
        { id: 3, student: 'Kasun Kalhara', studentId: 'ST1008', canteen: 'Central Mess Hall', item: 'Milk Rice', rating: 4, date: 'Yesterday, 8:45 AM' },
        { id: 4, student: 'Sunil Shantha', studentId: 'SF1002', canteen: 'Management Faculty Cafe', item: 'Fish Bun', rating: 2, date: 'Yesterday, 10:20 AM' },
        { id: 5, student: 'Dr. Nimal Silva', studentId: 'LC1001', canteen: 'Science Faculty Canteen', item: 'Fish Curry Rice', rating: 5, date: 'Yesterday, 1:30 PM' },
    ]);

    return (
        <div className="!animate-fade-in-up !relative">
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-8 !gap-4">
                <div>
                    <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight">Feedback & Ratings</h2>
                    <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Monitor canteen performance through simple star ratings.</p>
                </div>
            </div>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6 !mb-8">
                <div className="!bg-gradient-to-br !from-[#B52222]/90 !to-[#8a1919]/90 !backdrop-blur-xl !border !border-red-400/50 !rounded-3xl !p-8 !text-white !shadow-[0_8px_30px_rgba(181,34,34,0.3)] !flex !flex-col !items-center !justify-center !relative !overflow-hidden">
                    <div className="!absolute !top-0 !right-0 !w-32 !h-32 !bg-white !opacity-10 !rounded-full !-mr-10 !-mt-10"></div>
                    <div className="!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-white !opacity-10 !rounded-full !-ml-8 !-mb-8"></div>
                    <p className="!text-sm !font-bold !uppercase !tracking-widest !mb-2 !relative !z-10 !text-red-100">University Average</p>
                    <h3 className="!text-7xl !font-black !relative !z-10 !mb-2 !drop-shadow-lg">4.2</h3>
                    <div className="!flex !gap-1.5 !text-yellow-400 !relative !z-10 !drop-shadow-md">
                        {[1, 2, 3, 4].map(i => (
                            <svg key={i} className="!w-7 !h-7 !fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                        <svg className="!w-7 !h-7 !fill-current !opacity-40" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                </div>

                <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !p-8 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:!col-span-2 !flex !flex-col !justify-center">
                    <h3 className="!text-xl !font-black !text-gray-900 !mb-6">Rating Breakdown</h3>
                    <div className="!space-y-4">
                        {[
                            { stars: 5, pct: 65, count: 842, color: '!bg-green-500' },
                            { stars: 4, pct: 20, count: 256, color: '!bg-lime-500' },
                            { stars: 3, pct: 10, count: 124, color: '!bg-yellow-400' },
                            { stars: 2, pct: 3, count: 32, color: '!bg-orange-400' },
                            { stars: 1, pct: 2, count: 15, color: '!bg-red-500' },
                        ].map(row => (
                            <div key={row.stars} className="!flex !items-center !gap-4 !group">
                                <div className="!flex !items-center !gap-1.5 !w-12 !justify-end">
                                    <span className="!text-sm !font-black !text-gray-700">{row.stars}</span>
                                    <svg className="!w-4 !h-4 !text-yellow-400 !fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <div className="!flex-1 !h-3 !bg-white/60 !border !border-white/80 !rounded-full !overflow-hidden !shadow-inner">
                                    <div className={`!h-full ${row.color} !rounded-full !transition-all !duration-1000 !ease-out group-hover:!brightness-110`} style={{ width: `${row.pct}%` }}></div>
                                </div>
                                <div className="!text-xs !font-black !text-gray-500 !w-12 !text-right !tracking-wider">{row.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Canteens & Items Ratings Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6 !mb-8">
                
                {/* Canteen Ratings Section */}
                <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !p-8 !flex !flex-col">
                    <h3 className="!text-xl !font-black !text-gray-900 !mb-6 !flex !items-center !gap-2">
                        <svg className="!w-6 !h-6 !text-[#B52222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                        Canteen Average Ratings
                    </h3>
                    <div className="!space-y-4 !flex-1">
                        {[
                            { name: 'Central Mess Hall', rating: 4.8, reviews: 342 },
                            { name: 'Science Faculty Canteen', rating: 4.5, reviews: 128 },
                            { name: 'Management Faculty Cafe', rating: 3.9, reviews: 95 },
                            { name: 'Medical Faculty Canteen', rating: 4.2, reviews: 156 }
                        ].map((canteen, idx) => (
                            <div key={idx} className="!flex !items-center !justify-between !p-4 !bg-white/40 !backdrop-blur-md !rounded-2xl !border !border-white/60 hover:!bg-white/70 hover:!shadow-[0_4px_15px_rgba(0,0,0,0.05)] !transition-all !duration-300 !group">
                                <div>
                                    <h4 className="!font-bold !text-gray-900 group-hover:!text-[#B52222] !transition-colors">{canteen.name}</h4>
                                    <p className="!text-xs !font-black !text-gray-500 !mt-0.5 !tracking-wider">{canteen.reviews} RATINGS</p>
                                </div>
                                <div className="!flex !items-center !gap-2 !bg-white/50 !px-3 !py-1.5 !rounded-xl !border !border-white/80 !shadow-inner">
                                    <div className="!text-lg !font-black !text-gray-800">{canteen.rating}</div>
                                    <svg className="!w-5 !h-5 !text-yellow-400 !fill-current !drop-shadow-sm" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Items Ratings Section */}
                <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !p-8 !flex !flex-col !transition-all !duration-300 hover:!shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <h3 className="!text-xl !font-black !text-gray-900 !mb-6 !flex !items-center !gap-3">
                        <div className="!p-2 !bg-red-50 !rounded-xl !text-[#B52222] !shadow-inner !border !border-red-100">
                            <svg className="!w-5 !h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </div>
                        Top Rated Food Items
                    </h3>
                    <div className="!space-y-4 !flex-1">
                        {[
                            { name: 'Chicken Kottu', canteen: 'Central Mess Hall', rating: 4.9 },
                            { name: 'Fish Curry Rice', canteen: 'Science Faculty Canteen', rating: 4.7 },
                            { name: 'Cheese Omelet', canteen: 'Medical Faculty Canteen', rating: 4.6 },
                            { name: 'Iced Coffee', canteen: 'Management Faculty Cafe', rating: 4.4 }
                        ].map((item, idx) => (
                            <div key={idx} className="!flex !items-center !justify-between !p-4 !bg-white/40 !backdrop-blur-md !rounded-2xl !border !border-white/60 hover:!bg-white/70 hover:!shadow-[0_4px_15px_rgba(0,0,0,0.05)] !transition-all !duration-300 !group">
                                <div>
                                    <h4 className="!font-bold !text-gray-900 group-hover:!text-[#B52222] !transition-colors">{item.name}</h4>
                                    <p className="!text-xs !font-black !text-gray-500 !mt-0.5 !tracking-wider !uppercase">{item.canteen}</p>
                                </div>
                                <div className="!flex !items-center !gap-2 !bg-white/50 !px-3 !py-1.5 !rounded-xl !border !border-white/80 !shadow-inner">
                                    <div className="!text-lg !font-black !text-gray-800">{item.rating}</div>
                                    <svg className="!w-5 !h-5 !text-yellow-400 !fill-current !drop-shadow-sm" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Recent Ratings Table - Glassmorphism */}
            <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !overflow-hidden">
                <div className="!px-8 !py-6 !border-b !border-white/60 !bg-white/40 !flex !items-center !gap-3">
                    <svg className="!w-6 !h-6 !text-[#B52222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <h3 className="!text-xl !font-black !text-gray-900">Recent Ratings</h3>
                </div>
                <div className="!overflow-x-auto">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-white/20 !border-b !border-white/40">
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">User</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">Canteen</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">Order Item</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">Star Rating</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-white/40">
                            {reviews.map((rev) => (
                                <tr key={rev.id} className="hover:!bg-white/50 !transition-colors !group">
                                    <td className="!px-8 !py-5">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!w-10 !h-10 !rounded-full !bg-gradient-to-br !from-gray-100 !to-white !shadow-sm !border !border-gray-200/50 !flex !items-center !justify-center !font-black !text-gray-700">
                                                {rev.student.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="!font-bold !text-gray-900">{rev.student}</div>
                                                <div className="!text-[10px] !font-bold !text-gray-400 !uppercase !tracking-widest">{rev.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <span className="!inline-flex !px-3 !py-1 !rounded-lg !bg-gray-100/80 !text-xs !font-bold !text-gray-700 !border !border-gray-200/50">
                                            {rev.canteen}
                                        </span>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <div className="!font-bold !text-gray-800">{rev.item}</div>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <div className="!flex !items-center !gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`!w-5 !h-5 !transition-transform group-hover:!scale-110 ${i < rev.rating ? '!fill-yellow-400 !text-yellow-400 !drop-shadow-sm' : '!fill-gray-200/50 !text-gray-200/50'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="!px-8 !py-5 !text-right">
                                        <div className="!text-sm !font-bold !text-gray-500">
                                            {rev.date}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default FeedbackManagement;
