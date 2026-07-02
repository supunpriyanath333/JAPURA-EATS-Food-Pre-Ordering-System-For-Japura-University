import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    canteen_id: string | null;
    canteen_name: string;
}

interface Canteen {
    id: string;
    name: string;
}

interface RevenueAnalyticsProps {
    orders: Order[];
    canteens: Canteen[];
    onBack: () => void;
}

const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="!bg-white/90 !backdrop-blur-md !border !border-white/60 !rounded-2xl !p-3 !shadow-lg">
                <p className="!text-xs !font-bold !text-gray-500 !mb-1">{label}</p>
                <div className="!flex !items-center !gap-3">
                    <p className="!text-sm !font-black !text-gray-900">Rs. {data.revenue.toLocaleString()}</p>
                    {data.hasPrev && (
                        <div className={`!flex !items-center !text-xs !font-bold ${data.changeType === 'increase' ? '!text-green-600' : data.changeType === 'decrease' ? '!text-red-600' : '!text-gray-500'}`}>
                            {data.changeType === 'increase' ? (
                                <svg className="!w-3 !h-3 !mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path></svg>
                            ) : data.changeType === 'decrease' ? (
                                <svg className="!w-3 !h-3 !mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7"></path></svg>
                            ) : null}
                            {data.changeType !== 'neutral' ? `${Math.abs(data.percentageChange).toFixed(1)}%` : '-'}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const ComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="!bg-white/90 !backdrop-blur-md !border !border-white/60 !rounded-2xl !p-3 !shadow-lg">
                <p className="!text-xs !font-bold !text-gray-500 !mb-1">{label}</p>
                <p className="!text-sm !font-black !text-gray-900">Rs. {data.revenue.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
    const words = payload.value.split(' ');
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');

    return (
        <g transform={`translate(${x},${y}) rotate(-25)`}>
            <text x={0} y={0} textAnchor="middle" fill="#6B7280" fontSize={11} fontWeight="bold">
                <tspan x={-15} dy="12">{line1}</tspan>
                <tspan x={-15} dy="14">{line2}</tspan>
            </text>
        </g>
    );
};

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ orders, canteens, onBack }) => {
    const [selectedCanteen, setSelectedCanteen] = useState<string>('ALL');
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

    const filteredOrders = useMemo(() => {
        if (selectedCanteen === 'ALL') return orders;
        return orders.filter(o => o.canteen_id === selectedCanteen);
    }, [orders, selectedCanteen]);

    // Trend Chart Data
    const trendData = useMemo(() => {
        const dataMap: Record<string, { revenue: number, sortValue: number }> = {};
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

        const validOrders = filteredOrders.filter(o => new Date(o.created_at) >= startDate && new Date(o.created_at) <= now);

        validOrders.forEach(order => {
            const dateObj = new Date(order.created_at);
            let key = '';
            let sortValue = 0;

            if (timeRange === 'by month') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                sortValue = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime();
            } else if (timeRange === 'by week') {
                const day = dateObj.getDay();
                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(dateObj.getFullYear(), dateObj.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                sortValue = monday.getTime();
            } else if (timeRange === 'by day') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const dayStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
                sortValue = dayStart.getTime();
            }

            if (!dataMap[key]) {
                dataMap[key] = { revenue: 0, sortValue };
            }
            dataMap[key].revenue += (order.total_amount || 0);
        });

        const sortedKeys = Object.keys(dataMap).sort((a, b) => dataMap[a].sortValue - dataMap[b].sortValue);

        const sortedData = sortedKeys.map(key => ({
            date: key,
            revenue: dataMap[key].revenue
        }));

        return sortedData.map((item, index) => {
            let percentageChange = 0;
            let changeType = 'neutral';

            if (index > 0) {
                const prevRevenue = sortedData[index - 1].revenue;
                if (prevRevenue === 0) {
                    percentageChange = item.revenue > 0 ? 100 : 0;
                    changeType = item.revenue > 0 ? 'increase' : 'neutral';
                } else {
                    percentageChange = ((item.revenue - prevRevenue) / prevRevenue) * 100;
                    changeType = percentageChange > 0 ? 'increase' : percentageChange < 0 ? 'decrease' : 'neutral';
                }
            }

            return {
                ...item,
                percentageChange,
                changeType,
                hasPrev: index > 0
            };
        });
    }, [filteredOrders, timeRange, rangeDuration]);

    // Comparison Chart Data
    const comparisonData = useMemo(() => {
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

        const validOrders = filteredOrders.filter(o => new Date(o.created_at) >= startDate && new Date(o.created_at) <= now);
        
        const dataMap: Record<string, number> = {};
        
        validOrders.forEach(order => {
            const cName = order.canteen_name || 'Unknown Canteen';
            if (!dataMap[cName]) {
                dataMap[cName] = 0;
            }
            dataMap[cName] += (order.total_amount || 0);
        });

        return Object.keys(dataMap).map(key => ({
            canteenName: key,
            revenue: dataMap[key]
        })).sort((a, b) => b.revenue - a.revenue);
    }, [filteredOrders, compTimeRange, compRangeDuration]);

    // Summary Stats
    const todayOrders = filteredOrders.filter(o => {
        const orderDate = new Date(o.created_at);
        const today = new Date();
        return orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear();
    });
    const totalRevenueToday = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const COLORS = ['#B52222', '#D32F2F', '#E57373', '#EF9A9A', '#FFCDD2'];

    return (
        <div className="!animate-fade-in-up !relative !flex !flex-col !gap-6">
            {/* Header Area */}
            <div className="!flex !items-center !justify-between !bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !border !border-white/60">
                <div className="!flex !items-center !gap-4">
                    <button
                        onClick={onBack}
                        className="!p-2.5 !bg-white/80 hover:!bg-red-50 !text-gray-600 hover:!text-red-600 !rounded-xl !transition-colors !border !border-white/80 !shadow-sm"
                    >
                        <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <div>
                        <h2 className="!text-2xl !font-extrabold !text-gray-900 !tracking-tight">Revenue Analytics</h2>
                        <p className="!text-xs !font-bold !text-gray-500 !uppercase !tracking-wider !mt-1">Detailed view of financial performance</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="!flex !items-center !gap-3">
                    <span className="!text-sm !font-bold !text-gray-600">Filter by Canteen:</span>
                    <div className="!relative !w-48">
                        <select
                            value={selectedCanteen}
                            onChange={(e) => setSelectedCanteen(e.target.value)}
                            className="!appearance-none !bg-white/80 !backdrop-blur-md !border !border-white/80 !text-gray-900 !text-sm !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !w-full !py-2.5 !pl-3 !pr-9 !shadow-sm !outline-none !cursor-pointer"
                        >
                            <option value="ALL">All Canteens</option>
                            {canteens.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="!absolute !inset-y-0 !right-0 !flex !items-center !px-3 !pointer-events-none">
                            <svg className="!w-4 !h-4 !text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                <div className="!bg-gradient-to-br !from-red-50/80 !to-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60">
                    <p className="!text-sm !font-bold !text-[#B52222] !uppercase !tracking-wider !mb-2">Filtered Total Revenue Today</p>
                    <h3 className="!text-4xl !font-black !text-gray-900">Rs. {totalRevenueToday.toLocaleString()}</h3>
                </div>
                <div className="!bg-gradient-to-br !from-red-50/80 !to-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60">
                    <p className="!text-sm !font-bold !text-[#B52222] !uppercase !tracking-wider !mb-2">Filtered Total Revenue</p>
                    <h3 className="!text-4xl !font-black !text-gray-900">Rs. {totalRevenue.toLocaleString()}</h3>
                </div>
            </div>

            {/* Top Chart Area (Trend) */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !h-[450px] !flex !flex-col">
                <div className="!flex !items-center !justify-between !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Revenue Trend</h3>

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

                        {/* Time Range Toggle */}
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
                                title="Line Chart"
                            >
                                <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={`!p-1.5 !rounded-lg !transition-all ${chartType === 'bar' ? '!bg-white !text-[#B52222] !shadow-sm' : '!text-gray-500 hover:!text-gray-700'}`}
                                title="Bar Chart"
                            >
                                <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-4"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="!flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} tickFormatter={(val) => `Rs. ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                                <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }} />
                                <Bar dataKey="revenue" fill="#B52222" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        ) : (
                            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} tickFormatter={(val) => `Rs. ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                                <Tooltip content={<TrendTooltip />} />
                                <Line type="monotone" dataKey="revenue" stroke="#B52222" strokeWidth={4} dot={{ r: 6, fill: '#B52222', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Chart Area (Comparison) */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !h-[450px] !flex !flex-col">
                <div className="!flex !items-center !justify-between !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Canteen Revenue Comparison</h3>
                    
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

                        {/* Comp Time Range Toggle */}
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
                
                {comparisonData.length > 0 ? (
                    <div className="!flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="canteenName" axisLine={false} tickLine={false} tick={<CustomXAxisTick />} height={60} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} tickFormatter={(val) => `Rs. ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                                <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                    {comparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="!flex-1 !flex !items-center !justify-center">
                        <div className="!text-center !text-gray-400">
                            <svg className="!w-12 !h-12 !mx-auto !mb-3 !opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            <p className="!font-bold">No revenue data available for this range</p>
                        </div>
                    </div>
                )}
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

export default RevenueAnalytics;
