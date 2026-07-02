import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

interface User {
    id: string;
    created_at: string;
    role: string;
}

interface LoginLog {
    id: string;
    user_id: string;
    login_time: string;
}

interface UserAnalyticsProps {
    users: User[];
    loginLogs: LoginLog[];
    onBack: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="!bg-white/90 !backdrop-blur-md !border !border-white/60 !rounded-2xl !p-3 !shadow-lg">
                <p className="!text-xs !font-bold !text-gray-500 !mb-1">{label}</p>
                <p className="!text-sm !font-black !text-gray-900">{data.count} {data.label}</p>
            </div>
        );
    }
    return null;
};



const UserAnalytics: React.FC<UserAnalyticsProps> = ({ users, loginLogs, onBack }) => {
    const [timeRange, setTimeRange] = useState<'by day' | 'by week' | 'by month'>('by day');
    const [rangeDuration, setRangeDuration] = useState<number>(30);
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    const [compTimeRange, setCompTimeRange] = useState<'by day' | 'by week' | 'by month'>('by day');
    const [compRangeDuration, setCompRangeDuration] = useState<number>(30);

    const handleTimeRangeChange = (range: 'by day' | 'by week' | 'by month') => {
        setTimeRange(range);
        if (range === 'by day') setRangeDuration(30);
        else if (range === 'by week') setRangeDuration(10);
        else if (range === 'by month') setRangeDuration(12);
    };

    const handleCompTimeRangeChange = (range: 'by day' | 'by week' | 'by month') => {
        setCompTimeRange(range);
        if (range === 'by day') setCompRangeDuration(30);
        else if (range === 'by week') setCompRangeDuration(10);
        else if (range === 'by month') setCompRangeDuration(12);
    };

    const getDurationOptions = (tr: 'by day' | 'by week' | 'by month') => {
        if (tr === 'by day') {
            return [
                { label: 'Last 7 Days', value: 7 },
                { label: 'Last 10 Days', value: 10 },
                { label: 'Last 14 Days', value: 14 },
                { label: 'Last 30 Days', value: 30 },
            ];
        }
        if (tr === 'by week') {
            return [
                { label: 'Last 5 Weeks', value: 5 },
                { label: 'Last 10 Weeks', value: 10 },
                { label: 'Last 12 Weeks', value: 12 },
                { label: 'Last 24 Weeks', value: 24 },
            ];
        }
        if (tr === 'by month') {
            return [
                { label: 'Last 3 Months', value: 3 },
                { label: 'Last 6 Months', value: 6 },
                { label: 'Last 12 Months', value: 12 },
                { label: 'Last 24 Months', value: 24 },
            ];
        }
        return [];
    };

    // --- Active Users Trend Data (Top Chart) ---
    const trendData = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        let startDate = new Date();
        if (timeRange === 'by day') {
            startDate.setDate(now.getDate() - rangeDuration);
        } else if (timeRange === 'by week') {
            startDate.setDate(now.getDate() - (rangeDuration * 7));
        } else if (timeRange === 'by month') {
            startDate.setMonth(now.getMonth() - rangeDuration);
        }
        startDate.setHours(0, 0, 0, 0);

        const validLogs = loginLogs.filter(l => new Date(l.login_time) >= startDate && new Date(l.login_time) <= now);
        
        const dataMap: Record<string, Set<string>> = {};

        validLogs.forEach(log => {
            const dateObj = new Date(log.login_time);
            let key = '';
            
            if (timeRange === 'by month') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            } else if (timeRange === 'by week') {
                const day = dateObj.getDay();
                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(dateObj.getFullYear(), dateObj.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (timeRange === 'by day') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            if (!dataMap[key]) {
                dataMap[key] = new Set();
            }
            dataMap[key].add(log.user_id);
        });

        // Ensure all dates in range exist with 0
        const result = [];
        let curr = new Date(startDate);
        while (curr <= now) {
            let key = '';
            let nextDate = new Date(curr);
            
            if (timeRange === 'by month') {
                key = curr.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                nextDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
            } else if (timeRange === 'by week') {
                const day = curr.getDay();
                const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(curr.getFullYear(), curr.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                nextDate = new Date(monday);
                nextDate.setDate(monday.getDate() + 7);
            } else if (timeRange === 'by day') {
                key = curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                nextDate.setDate(curr.getDate() + 1);
            }

            if (!result.find(r => r.date === key)) {
                result.push({
                    date: key,
                    count: dataMap[key] ? dataMap[key].size : 0,
                    label: 'Active Users'
                });
            }
            curr = nextDate;
        }

        return result;
    }, [loginLogs, timeRange, rangeDuration]);

    // --- New User Registrations Data (Bottom Chart) ---
    const registrationData = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        let startDate = new Date();
        if (compTimeRange === 'by day') {
            startDate.setDate(now.getDate() - compRangeDuration);
        } else if (compTimeRange === 'by week') {
            startDate.setDate(now.getDate() - (compRangeDuration * 7));
        } else if (compTimeRange === 'by month') {
            startDate.setMonth(now.getMonth() - compRangeDuration);
        }
        startDate.setHours(0, 0, 0, 0);

        const validUsers = users.filter(u => new Date(u.created_at) >= startDate && new Date(u.created_at) <= now);
        
        const dataMap: Record<string, number> = {};

        validUsers.forEach(user => {
            const dateObj = new Date(user.created_at);
            let key = '';
            
            if (compTimeRange === 'by month') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            } else if (compTimeRange === 'by week') {
                const day = dateObj.getDay();
                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(dateObj.getFullYear(), dateObj.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (compTimeRange === 'by day') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            if (!dataMap[key]) {
                dataMap[key] = 0;
            }
            dataMap[key] += 1;
        });

        // Ensure all dates in range exist
        const result = [];
        let curr = new Date(startDate);
        while (curr <= now) {
            let key = '';
            let nextDate = new Date(curr);
            
            if (compTimeRange === 'by month') {
                key = curr.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                nextDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
            } else if (compTimeRange === 'by week') {
                const day = curr.getDay();
                const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(curr.getFullYear(), curr.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                nextDate = new Date(monday);
                nextDate.setDate(monday.getDate() + 7);
            } else if (compTimeRange === 'by day') {
                key = curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                nextDate.setDate(curr.getDate() + 1);
            }

            if (!result.find(r => r.date === key)) {
                result.push({
                    date: key,
                    count: dataMap[key] || 0,
                    label: 'Registrations'
                });
            }
            curr = nextDate;
        }

        return result;
    }, [users, compTimeRange, compRangeDuration]);

    const COLORS = ['#B52222', '#D32F2F', '#E57373', '#EF9A9A', '#FFCDD2'];
    const maxRegistrationCount = Math.max(...registrationData.map(d => d.count), 1);

    return (
        <div className="!animate-fade-in-up !relative !flex !flex-col !gap-6">
            <div className="!flex !items-center !gap-4">
                <button
                    onClick={onBack}
                    className="!p-2.5 !bg-white/80 hover:!bg-red-50 !text-gray-600 hover:!text-red-600 !rounded-xl !transition-colors !border !border-white/80 !shadow-sm"
                >
                    <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div>
                    <h2 className="!text-2xl !font-extrabold !text-gray-900 !tracking-tight">User Analytics</h2>
                    <p className="!text-xs !font-bold !text-gray-500 !uppercase !tracking-wider !mt-1">Detailed view of user engagement and growth</p>
                </div>
            </div>

            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !p-6 !shadow-sm">
                    <p className="!text-sm !font-bold !text-gray-500 !mb-2 !uppercase !tracking-wider">Active Users In Period</p>
                    <div className="!flex !items-baseline !gap-3">
                        <h4 className="!text-4xl !font-black !text-gray-900">
                            {trendData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                        </h4>
                    </div>
                </div>

                <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !p-6 !shadow-sm">
                    <p className="!text-sm !font-bold !text-gray-500 !mb-2 !uppercase !tracking-wider">New Registrations In Period</p>
                    <div className="!flex !items-baseline !gap-3">
                        <h4 className="!text-4xl !font-black !text-gray-900">
                            {registrationData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Top Chart Area (Active Users Trend) */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !h-[450px] !flex !flex-col">
                <div className="!flex !items-center !justify-between !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Active Users Trend (Logins)</h3>
                    
                    <div className="!flex !items-center !gap-4">
                        <div className="!relative">
                            <select
                                value={rangeDuration}
                                onChange={(e) => setRangeDuration(Number(e.target.value))}
                                className="!appearance-none !bg-white !backdrop-blur-md !border !border-white/80 !text-[#B52222] !text-xs !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !py-1.5 !pl-3 !pr-8 !shadow-sm !outline-none !cursor-pointer"
                            >
                                {getDurationOptions(timeRange).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="!absolute !inset-y-0 !right-0 !flex !items-center !px-2.5 !pointer-events-none">
                                <svg className="!w-3 !h-3 !text-[#B52222]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        <div className="!flex !bg-gray-200 !p-1 !rounded-xl !border !border-gray-300/50">
                            {(['by day', 'by week', 'by month'] as const).map(range => (
                                <button
                                    key={range}
                                    onClick={() => handleTimeRangeChange(range)}
                                    className={`!px-4 !py-1.5 !text-xs !font-bold !rounded-lg !capitalize !transition-all ${timeRange === range ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!text-gray-700'}`}
                                >
                                    {range === 'by day' ? 'Daily' : range === 'by week' ? 'Weekly' : 'Monthly'}
                                </button>
                            ))}
                        </div>
                        
                        <div className="!flex !bg-gray-200 !p-1 !rounded-xl !border !border-gray-300/50">
                            <button
                                onClick={() => setChartType('line')}
                                className={`!p-1.5 !rounded-lg !transition-all ${chartType === 'line' ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!text-gray-700'}`}
                            >
                                <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={`!p-1.5 !rounded-lg !transition-all ${chartType === 'bar' ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!text-gray-700'}`}
                            >
                                <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="!flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }} />
                                <Bar dataKey="count" fill="#B52222" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        ) : (
                            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="count" stroke="#B52222" strokeWidth={4} dot={{ r: 6, fill: '#B52222', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Chart Area (New User Registrations) */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !h-[450px] !flex !flex-col">
                <div className="!flex !items-center !justify-between !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">New User Registrations</h3>
                    
                    <div className="!flex !items-center !gap-4">
                        <div className="!relative">
                            <select
                                value={compRangeDuration}
                                onChange={(e) => setCompRangeDuration(Number(e.target.value))}
                                className="!appearance-none !bg-white !backdrop-blur-md !border !border-white/80 !text-[#B52222] !text-xs !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !py-1.5 !pl-3 !pr-8 !shadow-sm !outline-none !cursor-pointer"
                            >
                                {getDurationOptions(compTimeRange).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="!absolute !inset-y-0 !right-0 !flex !items-center !px-2.5 !pointer-events-none">
                                <svg className="!w-3 !h-3 !text-[#B52222]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        <div className="!flex !bg-gray-200 !p-1 !rounded-xl !border !border-gray-300/50">
                            {(['by day', 'by week', 'by month'] as const).map(range => (
                                <button
                                    key={range}
                                    onClick={() => handleCompTimeRangeChange(range)}
                                    className={`!px-4 !py-1.5 !text-xs !font-bold !rounded-lg !capitalize !transition-all ${compTimeRange === range ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!text-gray-700'}`}
                                >
                                    {range === 'by day' ? 'Daily' : range === 'by week' ? 'Weekly' : 'Monthly'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="!flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={registrationData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                {registrationData.map((entry, index) => {
                                    let colorIndex = Math.floor(((maxRegistrationCount - entry.count) / maxRegistrationCount) * COLORS.length);
                                    if (colorIndex >= COLORS.length) colorIndex = COLORS.length - 1;
                                    return <Cell key={`cell-${index}`} fill={COLORS[colorIndex]} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
};

export default UserAnalytics;
