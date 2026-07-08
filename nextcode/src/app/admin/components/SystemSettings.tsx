// src/app/admin/components/SystemSettings.tsx
import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
    const [holidayMode, setHolidayMode] = useState(false);

    return (
        <div className="!animate-fade-in-up !relative">
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-8 !gap-4">
                <div>
                    <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight">System Settings</h2>
                    <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Manage global system configurations and overrides.</p>
                </div>
            </div>
            
            {/* Holiday Mode Card - Glassmorphism */}
            <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !p-8 !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !mb-8 !transition-all !duration-300 hover:!shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="!flex !items-start !justify-between !gap-6">
                    <div className="!flex-1">
                        <h3 className="!text-xl !font-black !text-gray-900 !mb-3 !flex !items-center !gap-3">
                            <div className={`!w-10 !h-10 !rounded-xl !flex !items-center !justify-center !shadow-inner !border !border-white/80 ${holidayMode ? '!bg-red-100 !text-red-600' : '!bg-gray-100 !text-gray-500'}`}>
                                <svg className="!w-5 !h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            Holiday Mode
                            {holidayMode && (
                                <span className="!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-black !bg-red-500 !text-white !shadow-md !animate-pulse !tracking-widest !uppercase">
                                    Active
                                </span>
                            )}
                        </h3>
                        <p className="!text-sm !font-bold !text-gray-600 !max-w-2xl !leading-relaxed">
                            When enabled, the entire ordering system will be temporarily disabled for students and staff. Canteens will appear as closed, and no new orders can be placed. Use this during university holidays or special events.
                        </p>
                    </div>
                    
                    {/* Toggle Button */}
                    <button onClick={() => setHolidayMode(!holidayMode)}
                        className={`!cursor-pointer !relative !inline-flex !h-9 !w-16 !items-center !rounded-full !transition-all !duration-500 focus:!outline-none !shadow-inner !border !border-white/40 ${
                            holidayMode ? '!bg-gradient-to-r !from-red-500 !to-[#B52222]' : '!bg-gray-300'
                        }`}
                    >
                        <span 
                            className={`!inline-block !h-7 !w-7 !transform !rounded-full !bg-white !transition-transform !duration-500 !shadow-[0_2px_5px_rgba(0,0,0,0.2)] ${
                                holidayMode ? '!translate-x-8' : '!translate-x-1'
                            }`} 
                        />
                    </button>
                </div>

                {holidayMode && (
                    <div className="!mt-8 !bg-red-50/80 !backdrop-blur-md !border !border-red-200/50 !p-5 !rounded-2xl !shadow-sm">
                        <div className="!flex !items-start !gap-4">
                            <div className="!bg-red-100 !p-2 !rounded-full">
                                <svg className="!w-5 !h-5 !text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <div>
                                <h4 className="!text-sm !font-black !text-red-900 !uppercase !tracking-wider">Warning</h4>
                                <p className="!text-sm !font-bold !text-red-800/80 !mt-1">
                                    The ordering system is currently offline for users. Canteen owners can still log in to view past orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Automated Reports Card - Glassmorphism */}
            <div className="!bg-white/40 !backdrop-blur-xl !border !border-white/40 !rounded-3xl !p-8 !shadow-[0_8px_30px_rgb(0,0,0,0.02)] !opacity-70 !grayscale-[30%]">
                <div className="!flex !items-center !gap-4 !mb-3">
                    <div className="!w-10 !h-10 !rounded-xl !bg-gray-200/50 !flex !items-center !justify-center !shadow-inner !border !border-white/80">
                        <svg className="!w-5 !h-5 !text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                    <h3 className="!text-xl !font-black !text-gray-900">Automated Reports</h3>
                </div>
                <p className="!text-sm !font-bold !text-gray-500 !mb-5 !ml-14">Configure email settings for daily and weekly analytics reports.</p>
                <div className="!ml-14">
                    <span className="!inline-flex !items-center !px-4 !py-1.5 !rounded-full !text-xs !font-black !bg-gray-200/80 !text-gray-600 !uppercase !tracking-widest !shadow-inner !border !border-white/50">
                        Coming Soon
                    </span>
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
