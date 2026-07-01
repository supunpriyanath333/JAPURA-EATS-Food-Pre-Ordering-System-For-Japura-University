// src/app/admin/components/FeedbackManagement.tsx
import React, { useState } from 'react';

const FeedbackManagement: React.FC = () => {
    const [reviews] = useState([
        { id: 1, student: 'Kamal Perera', canteen: 'Central Mess Hall', item: 'Chicken Kottu', rating: 5, comment: 'Best kottu in the uni!', date: 'Today, 2:30 PM' },
        { id: 2, student: 'Amali Fernando', canteen: 'Science Faculty Canteen', item: 'Vegetable Rice', rating: 3, comment: 'A bit cold but tasty.', date: 'Today, 1:15 PM' },
        { id: 3, student: 'Kasun Kalhara', canteen: 'Central Mess Hall', item: 'Milk Rice', rating: 4, comment: 'Very good.', date: 'Yesterday, 8:45 AM' },
        { id: 4, student: 'Sunil Shantha', canteen: 'Management Faculty Cafe', item: 'Fish Bun', rating: 2, comment: 'Not fresh.', date: 'Yesterday, 10:20 AM' },
    ]);

    return (
        <div className="!animate-fade-in-up">
            <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight !mb-8">Feedback & Ratings</h2>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6 !mb-8">
                {/* Overall Rating */}
                <div className="!bg-gradient-to-br !from-[#B52222] !to-[#8a1919] !rounded-2xl !p-8 !text-white !shadow-lg !flex !flex-col !items-center !justify-center !relative !overflow-hidden">
                    <div className="!absolute !top-0 !right-0 !w-32 !h-32 !bg-white !opacity-10 !rounded-full !-mr-10 !-mt-10"></div>
                    <div className="!absolute !bottom-0 !left-0 !w-24 !h-24 !bg-white !opacity-10 !rounded-full !-ml-8 !-mb-8"></div>
                    <p className="!text-sm !font-bold !uppercase !tracking-wider !mb-2 !relative !z-10">University Average</p>
                    <h3 className="!text-6xl !font-black !relative !z-10 !mb-2">4.2</h3>
                    <div className="!flex !gap-1 !text-yellow-400 !relative !z-10">
                        {[1, 2, 3, 4].map(i => (
                            <svg key={i} className="!w-6 !h-6 !fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                        <svg className="!w-6 !h-6 !fill-current !opacity-30" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="!bg-white !rounded-2xl !p-6 !shadow-sm !border !border-gray-100 md:!col-span-2">
                    <h3 className="!text-lg !font-extrabold !text-gray-900 !mb-4">Rating Breakdown</h3>
                    <div className="!space-y-3">
                        {[
                            { stars: 5, pct: 65, count: 842 },
                            { stars: 4, pct: 20, count: 256 },
                            { stars: 3, pct: 10, count: 124 },
                            { stars: 2, pct: 3, count: 32 },
                            { stars: 1, pct: 2, count: 15 },
                        ].map(row => (
                            <div key={row.stars} className="!flex !items-center !gap-4">
                                <div className="!flex !items-center !gap-1 !w-12">
                                    <span className="!text-sm !font-bold !text-gray-700">{row.stars}</span>
                                    <svg className="!w-4 !h-4 !text-yellow-400 !fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <div className="!flex-1 !h-2.5 !bg-gray-100 !rounded-full !overflow-hidden">
                                    <div className="!h-full !bg-yellow-400 !rounded-full" style={{ width: `${row.pct}%` }}></div>
                                </div>
                                <div className="!text-xs !font-bold !text-gray-500 !w-10 !text-right">{row.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Reviews Table */}
            <div className="!bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !overflow-hidden">
                <div className="!px-6 !py-4 !border-b !border-gray-100 !flex !justify-between !items-center">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Recent Feedbacks</h3>
                </div>
                <div className="!overflow-x-auto">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-gray-50/50 !border-b !border-gray-100">
                                <th className="!px-6 !py-4 !text-xs !font-bold !text-gray-500 !uppercase !tracking-wider">User</th>
                                <th className="!px-6 !py-4 !text-xs !font-bold !text-gray-500 !uppercase !tracking-wider">Canteen & Item</th>
                                <th className="!px-6 !py-4 !text-xs !font-bold !text-gray-500 !uppercase !tracking-wider">Rating</th>
                                <th className="!px-6 !py-4 !text-xs !font-bold !text-gray-500 !uppercase !tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-gray-50">
                            {reviews.map((rev) => (
                                <tr key={rev.id} className="hover:!bg-gray-50/50 !transition-colors">
                                    <td className="!px-6 !py-4">
                                        <div className="!font-bold !text-gray-900">{rev.student}</div>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <div className="!font-semibold !text-gray-900">{rev.item}</div>
                                        <div className="!text-xs !text-gray-500">{rev.canteen}</div>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <div className="!flex !items-center !gap-2">
                                            <div className="!flex !text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`!w-4 !h-4 ${i < rev.rating ? '!fill-current' : '!fill-gray-200 !text-gray-200'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                                ))}
                                            </div>
                                        </div>
                                        {rev.comment && <div className="!text-sm !text-gray-600 !mt-1 !italic">"{rev.comment}"</div>}
                                    </td>
                                    <td className="!px-6 !py-4 !text-sm !font-semibold !text-gray-500">
                                        {rev.date}
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
