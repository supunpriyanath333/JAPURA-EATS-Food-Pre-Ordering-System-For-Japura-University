import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface Order {
    id: string;
    user_id?: string;
    created_at: string;
    status: string;
    total_amount: number;
    payment_method: string;
    dining_option?: string;
    pickup_time_slot?: string;
    cancellation_reason?: string | null;
    canteen_id: string | null;
    canteen_name: string;
    items: string[];
}

interface Canteen {
    id: string;
    name: string;
}

interface AnalyticsDetailsProps {
    orders: Order[];
    canteens: Canteen[];
    onBack: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="!bg-white/90 !backdrop-blur-md !border !border-white/60 !rounded-2xl !p-3 !shadow-lg">
                <p className="!text-xs !font-bold !text-gray-500 !mb-1">{label}</p>
                <div className="!flex !items-center !gap-3">
                    <p className="!text-sm !font-black !text-gray-900">{data.orders} Orders</p>
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

const AnalyticsDetails: React.FC<AnalyticsDetailsProps> = ({ orders, canteens, onBack }) => {
    const [selectedCanteen, setSelectedCanteen] = useState<string>('ALL');
    const [timeRange, setTimeRange] = useState<'by day' | 'by week' | 'by month'>('by day');
    const [rangeDuration, setRangeDuration] = useState<number>(30); // Default to 30 days
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [visibleOrderCount, setVisibleOrderCount] = useState<number>(10);

    const handleTimeRangeChange = (range: 'by day' | 'by week' | 'by month') => {
        setTimeRange(range);
        // Set sensible defaults for the new range
        if (range === 'by day') setRangeDuration(30);
        else if (range === 'by week') setRangeDuration(10);
        else if (range === 'by month') setRangeDuration(12);
    };

    const getDurationOptions = () => {
        if (timeRange === 'by day') {
            return [
                { label: 'Last 7 Days', value: 7 },
                { label: 'Last 10 Days', value: 10 },
                { label: 'Last 14 Days', value: 14 },
                { label: 'Last 30 Days', value: 30 },
            ];
        }
        if (timeRange === 'by week') {
            return [
                { label: 'Last 5 Weeks', value: 5 },
                { label: 'Last 10 Weeks', value: 10 },
                { label: 'Last 12 Weeks', value: 12 },
                { label: 'Last 24 Weeks', value: 24 },
            ];
        }
        if (timeRange === 'by month') {
            return [
                { label: 'Last 3 Months', value: 3 },
                { label: 'Last 6 Months', value: 6 },
                { label: 'Last 12 Months', value: 12 },
                { label: 'Last 24 Months', value: 24 },
            ];
        }
        return [];
    };

    // Filter orders by canteen
    const filteredOrders = useMemo(() => {
        if (selectedCanteen === 'ALL') return orders;
        return orders.filter(o => o.canteen_id === selectedCanteen);
    }, [orders, selectedCanteen]);

    // Data for Charts based on Time Range
    const chartData = useMemo(() => {
        const dataMap: Record<string, { count: number, sortValue: number }> = {};
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
            // Important: Create a fresh Date object so we don't mutate the original if we do calculations
            const dateObj = new Date(order.created_at);
            let key = '';
            let sortValue = 0; // To keep them in correct chronological order

            if (timeRange === 'by month') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); // e.g., "Jan 24"
                sortValue = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime();
            } else if (timeRange === 'by week') {
                // Calculate the Monday of this week
                const day = dateObj.getDay();
                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(dateObj.getFullYear(), dateObj.getMonth(), diff);
                monday.setHours(0, 0, 0, 0);
                key = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., "Week of Jun 17"
                sortValue = monday.getTime();
            } else if (timeRange === 'by day') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., "Jun 24"
                const dayStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
                sortValue = dayStart.getTime();
            }

            if (!dataMap[key]) {
                dataMap[key] = { count: 0, sortValue };
            }
            dataMap[key].count += 1;
        });

        // Convert to array and sort
        const sortedKeys = Object.keys(dataMap).sort((a, b) => dataMap[a].sortValue - dataMap[b].sortValue);

        const sortedData = sortedKeys.map(key => ({
            date: key,
            orders: dataMap[key].count
        }));

        return sortedData.map((item, index) => {
            let percentageChange = 0;
            let changeType = 'neutral';

            if (index > 0) {
                const prevOrders = sortedData[index - 1].orders;
                if (prevOrders === 0) {
                    percentageChange = item.orders > 0 ? 100 : 0;
                    changeType = item.orders > 0 ? 'increase' : 'neutral';
                } else {
                    percentageChange = ((item.orders - prevOrders) / prevOrders) * 100;
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

    // Summary Stats
    const totalOrders = filteredOrders.length;
    const totalOrdersToday = filteredOrders.filter(o => {
        const orderDate = new Date(o.created_at);
        const today = new Date();
        return orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear();
    }).length;

    // Table specific filtering
    const finalTableOrders = useMemo(() => {
        return filteredOrders.filter(order => {
            // 1. Search Query
            if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase().replace('#', ''))) {
                return false;
            }

            // 2. Date Filter
            if (filterDate) {
                // local date string match
                const orderDateObj = new Date(order.created_at);
                const orderDateStr = `${orderDateObj.getFullYear()}-${String(orderDateObj.getMonth() + 1).padStart(2, '0')}-${String(orderDateObj.getDate()).padStart(2, '0')}`;
                if (orderDateStr !== filterDate) return false;
            }

            // 3. Status Filter
            if (filterStatus !== 'ALL' && order.status !== filterStatus) {
                return false;
            }

            return true;
        });
    }, [filteredOrders, searchQuery, filterDate, filterStatus]);

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
                        <h2 className="!text-2xl !font-extrabold !text-gray-900 !tracking-tight">Analytics Details</h2>
                        <p className="!text-xs !font-bold !text-gray-500 !uppercase !tracking-wider !mt-1">Detailed view of order statistics</p>
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
                    <p className="!text-sm !font-bold !text-[#B52222] !uppercase !tracking-wider !mb-2">Filtered Total Orders Today</p>
                    <h3 className="!text-4xl !font-black !text-gray-900">{totalOrdersToday}</h3>
                </div>
                <div className="!bg-gradient-to-br !from-red-50/80 !to-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60">
                    <p className="!text-sm !font-bold !text-[#B52222] !uppercase !tracking-wider !mb-2">Filtered Total Orders</p>
                    <h3 className="!text-4xl !font-black !text-gray-900">{totalOrders}</h3>
                </div>
            </div>

            {/* Chart Area */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !h-[450px] !flex !flex-col">
                <div className="!flex !items-center !justify-between !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Orders Trend</h3>

                    <div className="!flex !items-center !gap-4">
                        {/* Custom Duration Dropdown */}
                        <div className="!relative">
                            <select
                                value={rangeDuration}
                                onChange={(e) => setRangeDuration(Number(e.target.value))}
                                className="!appearance-none !bg-white !backdrop-blur-md !border !border-white/80 !text-[#B52222] !text-xs !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !py-1.5 !pl-3 !pr-8 !shadow-sm !outline-none !cursor-pointer"
                            >
                                {getDurationOptions().map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="!absolute !inset-y-0 !right-0 !flex !items-center !px-2.5 !pointer-events-none">
                                <svg className="!w-3.5 !h-3.5 !text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
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
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Toggle */}
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
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }} />
                                <Bar dataKey="orders" fill="#B52222" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }} angle={-45} textAnchor="end" height={60} dx={-5} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="orders" stroke="#B52222" strokeWidth={4} dot={{ r: 6, fill: '#B52222', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table Area */}
            <div className="!bg-white/60 !backdrop-blur-xl !rounded-3xl !p-6 !shadow-sm !border !border-white/60 !overflow-hidden">
                <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-4 !mb-6">
                    <h3 className="!text-lg !font-extrabold !text-gray-900">Detailed Order History</h3>
                    <div className="!flex !flex-col sm:!flex-row !items-center !gap-3 !w-full md:!w-auto">

                        {/* Search Input */}
                        <div className="!relative !w-full sm:!w-48">
                            <input
                                type="text"
                                placeholder="Search ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="!w-full !bg-white/80 !backdrop-blur-md !border !border-white/80 !text-gray-900 !text-sm !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !pl-10 !p-2 !shadow-sm !outline-none"
                            />
                            <div className="!absolute !inset-y-0 !left-0 !flex !items-center !pl-3 !pointer-events-none">
                                <svg className="!w-4 !h-4 !text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div
                            className="!relative !w-full sm:!w-auto !flex !items-center !justify-center !bg-white/100 !backdrop-blur-md !border !border-white/80 !rounded-xl !p-2 !shadow-sm !cursor-pointer hover:!bg-white !transition-colors"
                            title={filterDate ? "Change Date" : "Filter by Date"}
                            onClick={(e) => {
                                const input = e.currentTarget.querySelector('input[type="date"]');
                                if (input && 'showPicker' in input) {
                                    try { (input as any).showPicker(); } catch (err) { }
                                }
                            }}
                        >
                            <svg className={`!w-5 !h-5 ${filterDate ? '!text-[#B52222]' : '!text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {filterDate && (
                                <span className="!text-sm !font-bold !text-[#B52222] !ml-2">
                                    {new Date(filterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="!absolute !inset-0 !w-full !h-full !opacity-0 !cursor-pointer"
                            />
                            {/* Clear Date Button (only shows if date is selected) */}
                            {filterDate && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFilterDate(''); }}
                                    className="!ml-2 !p-0.5 !rounded-full hover:!bg-red-100 !text-gray-400 hover:!text-red-500 !transition-colors !z-10"
                                    title="Clear Filter"
                                >
                                    <svg className="!w-4 !h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="!relative !w-full sm:!w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="!appearance-none !w-full !bg-white/80 !backdrop-blur-md !border !border-white/80 !text-gray-700 !text-sm !font-bold !rounded-xl !focus:ring-[#B52222] !focus:border-[#B52222] !block !py-2 !pl-3 !pr-9 !shadow-sm !outline-none !cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="accepted">Accepted</option>
                                <option value="processing">Processing</option>
                                <option value="ready">Ready</option>
                                <option value="picked_up">Picked Up</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="!absolute !inset-y-0 !right-0 !flex !items-center !px-3 !pointer-events-none">
                                <svg className="!w-4 !h-4 !text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="!overflow-x-auto !pb-4">
                    <table className="!w-full !min-w-max !text-left !border-collapse">
                        <thead>
                            <tr className="!border-b-2 !border-gray-200">
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Order ID</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">User ID</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Date & Time</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Canteen</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Items</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Payment</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Dining</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Pickup Time</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Total</th>
                                <th className="!py-3 !px-4 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalTableOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="!py-8 !text-center !text-sm !font-bold !text-gray-500">No orders found matching your criteria.</td>
                                </tr>
                            ) : finalTableOrders.map(order => (
                                <tr key={order.id} className="!border-b !border-gray-100 hover:!bg-white/50 !transition-colors">
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-900 !whitespace-nowrap">#{order.id.slice(0, 6).toUpperCase()}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">{order.user_id || 'N/A'}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">
                                        {new Date(order.created_at).toLocaleDateString()} <br />
                                        <span className="!text-xs !text-gray-400">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-700 !whitespace-nowrap">{order.canteen_name}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">
                                        {order.items.length > 2 ? `${order.items[0]}, +${order.items.length - 1} more` : order.items.join(', ')}
                                    </td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">{order.payment_method || 'N/A'}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">{order.dining_option || 'N/A'}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-bold !text-gray-600 !whitespace-nowrap">{order.pickup_time_slot || 'N/A'}</td>
                                    <td className="!py-3 !px-4 !text-sm !font-black !text-[#B52222] !whitespace-nowrap">Rs. {order.total_amount?.toFixed(2)}</td>
                                    <td className="!py-3 !px-4 !whitespace-nowrap">
                                        <div className="!flex !flex-col !gap-1">
                                            <span className={`!px-3 !py-1 !rounded-full !text-[10px] !font-black !uppercase !tracking-wider !w-fit ${order.status === 'accepted' || order.status === 'processing' || order.status === 'ready' || order.status === 'picked_up' ? '!bg-green-100 !text-green-700' :
                                                order.status === 'cancelled' ? '!bg-red-100 !text-red-700' :
                                                    '!bg-yellow-100 !text-yellow-700'
                                                }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            {order.status === 'cancelled' && order.cancellation_reason && (
                                                <span className="!text-[9px] !font-bold !text-red-500 !uppercase tracking-wider">
                                                    ({order.cancellation_reason})
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDetails;
