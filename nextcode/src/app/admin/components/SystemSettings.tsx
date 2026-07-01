// src/app/admin/components/SystemSettings.tsx
import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
    const [holidayMode, setHolidayMode] = useState(false);

    return (
        <div className="!animate-fade-in-up">
            <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight !mb-8">System Settings</h2>
            
            <div className="!bg-white !rounded-2xl !p-8 !shadow-sm !border !border-gray-100 !mb-8">
                <div className="!flex !items-start !justify-between !gap-4">
                    <div>
                        <h3 className="!text-xl !font-extrabold !text-gray-900 !mb-2 !flex !items-center !gap-2">
                            Holiday Mode
                            {holidayMode && (
                                <span className="!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-bold !bg-red-100 !text-red-800 !animate-pulse">
                                    ACTIVE
                                </span>
                            )}
                        </h3>
                        <p className="!text-sm !font-semibold !text-gray-500 !max-w-2xl">
                            When enabled, the entire ordering system will be temporarily disabled for students and staff. Canteens will appear as closed, and no new orders can be placed. Use this during university holidays or special events.
                        </p>
                    </div>
                    
                    {/* Toggle Button */}
                    <button 
                        onClick={() => setHolidayMode(!holidayMode)}
                        className={`!relative !inline-flex !h-8 !w-14 !items-center !rounded-full !transition-colors !cursor-pointer focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/50 ${
                            holidayMode ? '!bg-[#B52222]' : '!bg-gray-200'
                        }`}
                    >
                        <span 
                            className={`!inline-block !h-6 !w-6 !transform !rounded-full !bg-white !transition-transform !shadow-sm ${
                                holidayMode ? '!translate-x-7' : '!translate-x-1'
                            }`} 
                        />
                    </button>
                </div>

                {holidayMode && (
                    <div className="!mt-6 !bg-red-50 !border-l-4 !border-red-500 !p-4 !rounded-r-lg">
                        <div className="!flex !items-start !gap-3">
                            <svg className="!w-6 !h-6 !text-red-600 !mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <div>
                                <h4 className="!text-sm !font-bold !text-red-800">Warning</h4>
                                <p className="!text-sm !font-semibold !text-red-700 !mt-1">
                                    The ordering system is currently offline for users. Canteen owners can still log in to view past orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="!bg-white !rounded-2xl !p-8 !shadow-sm !border !border-gray-100 !opacity-50">
                <h3 className="!text-xl !font-extrabold !text-gray-900 !mb-2">Automated Reports</h3>
                <p className="!text-sm !font-semibold !text-gray-500 !mb-4">Configure email settings for daily and weekly analytics reports.</p>
                <div className="!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-bold !bg-gray-100 !text-gray-500">
                    Coming Soon
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

export default SystemSettings;
