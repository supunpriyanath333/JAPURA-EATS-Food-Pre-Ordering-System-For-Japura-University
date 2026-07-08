import { useState, useCallback, useEffect } from "react";
// Assuming global type definitions are available via this path or similar
// import { Order } from "../../../../global"; 

// --- Frontend Prop Definitions ---
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';

export interface OrderItem {
    name: string;
    quantity: number;
    special_instructions?: string;
}

export interface Order {
    id: string;
    userName?: string;
    otp: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    date: string;
    time: string;
    pickup_time: string;
    payment: 'Card' | 'Cash';
    diningOption?: 'Dine-in' | 'Takeaway';
}
// ---

// 🎯 Status flow array defined globally for both helper and component
const STATUS_FLOW: OrderStatus[] = ['accepted', 'preparing', 'ready', 'picked_up'];

// NOTE: The database statuses are used here: pending, accepted, preparing, ready_for_pickup, delivered, cancelled
const STATUS_COLORS: { [key in Order['status'] | 'pending' | 'cancelled']: string } = {
    pending: 'bg-[#B52222]',
    cancelled: 'bg-red-500',
    accepted: 'bg-[#B52222]',
    preparing: 'bg-[#B52222]',
    ready: 'bg-[#B52222]',
    picked_up: 'bg-[#B52222]',
};

const STATUS_TEXT_COLORS: { [key in Order['status'] | 'pending' | 'cancelled']: string } = {
    pending: 'text-[#B52222]',
    cancelled: 'text-gray-500',
    accepted: 'text-[#B52222]',
    preparing: 'text-[#B52222]',
    ready: 'text-[#B52222]',
    picked_up: 'text-[#B52222]',
};

// Helper to determine the next step in the flow
const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    return currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null;
};
// Helper to get status icon
const getStatusIcon = (status: OrderStatus, className: string) => {
    switch (status) {
        case 'accepted':
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
        case 'preparing':
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
        case 'ready':
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
        case 'picked_up':
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
        default:
            return null;
    }
};

// --- OrderCard Component ---
interface OrderCardProps {
    order: Order;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, updateOrderStatus }) => {
    const nextStatus = getNextStatus(order.status);
    const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
    const statusBgClass = STATUS_COLORS[order.status] || 'bg-gray-400';
    const statusTextClass = STATUS_TEXT_COLORS[order.status] || 'text-gray-500';

    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
    const [enteredPin, setEnteredPin] = useState("");
    const [pinError, setPinError] = useState("");

    const handleUpdateClick = () => {
        if (order.id && nextStatus) {
            if (nextStatus === 'picked_up') {
                setIsPickupModalOpen(true);
                setEnteredPin("");
                setPinError("");
            } else {
                updateOrderStatus(order.id, nextStatus);
            }
        } else {
            console.error("Cannot update status: Order ID is invalid or next status is null.");
            alert("Error: Cannot proceed with status update.");
        }
    };

    const handleConfirmPickup = () => {
        if (enteredPin === order.otp) {
            updateOrderStatus(order.id, 'picked_up');
            setIsPickupModalOpen(false);
        } else {
            setPinError("Incorrect PIN! Please check with the customer.");
        }
    };

    return (
        <>
            <div className="!bg-white/80 !backdrop-blur-xl !p-6 !rounded-2xl !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !flex !flex-col md:!flex-row !gap-6 !border !border-white/60 !relative !overflow-hidden !transition-transform hover:!-translate-y-1 !duration-300">
                {/* Status Indicator Bar */}
                <div className={`!absolute !left-0 !top-0 !bottom-0 !w-1.5 ${statusBgClass}`} />

                {/* Left Column: Details */}
                <div className="!flex-1 !flex !flex-col !min-w-[280px]">
                    {/* Header & Status */}
                    <div className="!flex !justify-between !items-start !mb-4 !pb-4 !border-b !border-gray-100">
                        <div>
                            <h4 className="!font-extrabold !text-xl !text-gray-900">Order #{order.id.substring(0, 8).toUpperCase()}</h4>
                            <span className={`!inline-block !text-[11px] !font-bold !uppercase !tracking-wider !px-3 !py-1 !rounded-full !text-white ${statusBgClass} !mt-2 !shadow-sm`}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="!text-right !flex !flex-col !items-end">
                            <div className="!flex !items-center !gap-2 !text-[10px] !font-bold !text-gray-500 !mb-1 !bg-gray-100 !px-2 !py-1 !rounded-md !whitespace-nowrap">
                                <span className="!flex !items-center !gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="!h-3 !w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {order.date}
                                </span>
                                <span className="!text-gray-300">|</span>
                                <span className="!flex !items-center !gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="!h-3 !w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {order.time}
                                </span>
                            </div>
                            <p className="!text-xl !font-black !text-[#B52222]">Rs. {order.total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="!pt-2 !flex-grow">
                        <h5 className="!text-xs !font-black !text-gray-400 !uppercase !tracking-wider !mb-3">Order Items</h5>
                        <ul className="!space-y-3 !mb-4">
                            {order.items.map((item, index) => (
                                <li key={index} className="!text-sm !font-semibold !text-gray-700 !flex !flex-col !gap-1">
                                    <div className="!flex !items-start">
                                        <span className="!text-[#B52222] !mr-2 !mt-0.5">•</span>
                                        <span>{item.name} <span className="!text-gray-400 !ml-1">x {item.quantity}</span></span>
                                    </div>
                                    {item.special_instructions && (
                                        <div className="!pl-4 !ml-1.5 !border-l-2 !border-gray-300 !text-xs !italic !text-gray-500 !bg-gray-50 !p-1.5 !rounded-r-md">
                                            <span className="!font-bold !not-italic !mr-1 !text-gray-600">Note:</span>
                                            {item.special_instructions}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="!mt-4 !text-sm !font-medium !flex !flex-col !gap-2 !bg-gray-50/50 !p-3 !rounded-xl">
                            <div className="!flex !justify-between !border-b !border-gray-200 !pb-2">
                                <span className="!text-gray-500">Pick-up Time</span>
                                <span className="!font-bold !text-gray-900">{order.pickup_time || 'ASAP'}</span>
                            </div>
                            {order.diningOption && (
                                <div className="!flex !justify-between !border-b !border-gray-200 !pb-2">
                                    <span className="!text-gray-500">Dining Option</span>
                                    <span className="!font-bold !text-gray-900">{order.diningOption}</span>
                                </div>
                            )}
                            <div className="!flex !justify-between">
                                <span className="!text-gray-500">Payment Method</span>
                                <span className="!font-bold !text-gray-900">{order.payment}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Progress & Actions */}
                <div className="!flex-1 !flex !flex-col !justify-center !gap-10 !min-w-[280px] md:!pl-6 md:!border-l !border-gray-100">
                    {/* Progress Bar */}
                    <div className="!flex !justify-between !items-center !text-center">
                        {STATUS_FLOW.map((status, index) => {
                            const isCompleted = currentStatusIndex >= index;
                            const isActive = currentStatusIndex === index;
                            return (
                                <div key={status} className="!flex !flex-col !items-center !flex-1 !relative">
                                    <div className="!relative !w-full !flex !justify-center !items-center">
                                        {/* Connecting Line */}
                                        {index < STATUS_FLOW.length - 1 && (
                                            <div className={`!absolute !w-full !h-1 !left-[50%] !top-[50%] !-translate-y-[50%] !rounded-full !transition-colors !duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} style={{ zIndex: 0 }} />
                                        )}
                                        {/* Status Circle */}
                                        <div className={`!w-8 !h-8 !rounded-full !flex !items-center !justify-center !transition-all !duration-500 !z-10 !border-[3px] ${isActive ? 'bg-white border-green-500 text-green-500 shadow-md scale-110' :
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                    'bg-gray-100 border-gray-300 text-gray-400'
                                            }`}>
                                            {getStatusIcon(status, "!w-4 !h-4")}
                                        </div>
                                    </div>
                                    <span className={`!text-[10px] !font-bold !uppercase !mt-2 !tracking-wider ${isActive ? 'text-green-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                                        {status.replace('_', ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Button */}
                    <div>
                        {nextStatus && (
                            <button onClick={handleUpdateClick}
                                className="!w-full !py-3.5 !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !transition-all !duration-300 !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 active:!scale-[0.98] !flex !justify-center !items-center !gap-2">
                                <span>MARK AS {nextStatus.toUpperCase().replace('_', ' ')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="!h-5 !w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                        {order.status === 'picked_up' && (
                            <div className="!text-center !py-3 !rounded-xl !bg-green-50 !text-green-600 !font-black !uppercase !tracking-widest !border !border-green-200">
                                Order Completed
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pickup Modal */}
            {isPickupModalOpen && (
                <div className="!fixed !inset-0 !z-[100] !flex !items-center !justify-center !bg-black/60 !backdrop-blur-sm !p-4">
                    <div className="!bg-white !rounded-3xl !shadow-2xl !w-full !max-w-md !overflow-hidden !animate-in !fade-in !zoom-in !duration-300">
                        <div className="!bg-[#B52222] !p-6 !text-white !text-center !relative">
                            <h2 className="!text-2xl !font-black !tracking-tight">Complete Pickup</h2>
                            <p className="!text-red-100 !text-sm !mt-1">Verify PIN to hand over the order</p>
                            <button onClick={() => setIsPickupModalOpen(false)} className="!absolute !top-4 !right-4 !text-white/80 hover:!text-white !bg-white/10 hover:!bg-white/20 !p-1.5 !rounded-full !transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="!h-5 !w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="!p-6 !space-y-4">
                            {/* Order Info */}
                            <div className="!bg-gray-50 !rounded-xl !p-4 !border !border-gray-100 !space-y-2">
                                <div className="!flex !justify-between">
                                    <span className="!text-sm !text-gray-500">Order ID:</span>
                                    <span className="!font-bold !text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="!flex !justify-between">
                                    <span className="!text-sm !text-gray-500">Customer:</span>
                                    <span className="!font-bold !text-gray-900">{order.userName}</span>
                                </div>
                                <div className="!flex !justify-between">
                                    <span className="!text-sm !text-gray-500">Time Slot:</span>
                                    <span className="!font-bold !text-gray-900">{order.pickup_time || 'ASAP'}</span>
                                </div>
                                <div className="!flex !justify-between">
                                    <span className="!text-sm !text-gray-500">Dining Option:</span>
                                    <span className="!font-bold !text-gray-900">{order.diningOption || 'N/A'}</span>
                                </div>
                                <div className="!flex !justify-between !items-center !pt-2 !border-t !border-gray-200 !mt-2">
                                    <span className="!text-sm !text-gray-500">Payment:</span>
                                    <span className={`!px-3 !py-1 !rounded-full !text-xs !font-bold ${order.payment === 'Cash' ? '!bg-amber-100 !text-amber-800' : '!bg-green-100 !text-green-800'}`}>
                                        {order.payment}
                                    </span>
                                </div>
                            </div>

                            {/* Amount to collect for Cash orders */}
                            {order.payment === 'Cash' && (
                                <div className="!bg-amber-50 !border !border-amber-200 !rounded-xl !p-4 !text-center">
                                    <p className="!text-xs !font-bold !text-amber-800 !uppercase !tracking-wider">Amount to Collect</p>
                                    <p className="!text-3xl !font-black !text-amber-600 !mt-1">Rs. {order.total.toFixed(2)}</p>
                                </div>
                            )}

                            {/* PIN Input */}
                            <div className="!pt-4 !pb-2">
                                <p className="!text-xs !font-black !text-gray-700 !text-center !mb-3 !uppercase !tracking-[0.2em] !drop-shadow-sm">Enter 4-Digit PIN</p>
                                <div className="!flex !justify-center !gap-3">
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            id={`pin-input-${order.id}-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={enteredPin[index] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                // Handle pasting multiple numbers
                                                if (val.length > 1) { 
                                                    setEnteredPin(val.substring(0, 4));
                                                    document.getElementById(`pin-input-${order.id}-3`)?.focus();
                                                    return;
                                                }
                                                const newPin = enteredPin.split('');
                                                newPin[index] = val;
                                                setEnteredPin(newPin.join(''));
                                                if (val && index < 3) {
                                                    document.getElementById(`pin-input-${order.id}-${index + 1}`)?.focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !enteredPin[index] && index > 0) {
                                                    document.getElementById(`pin-input-${order.id}-${index - 1}`)?.focus();
                                                }
                                            }}
                                            placeholder="•"
                                            className="!w-16 !h-16 !text-center !text-3xl !font-black !bg-gray-50 !border-2 !border-gray-300 focus:!bg-white focus:!border-[#B52222] focus:!ring-4 focus:!ring-[#B52222]/20 !outline-none !transition-all !rounded-2xl !text-gray-900 !shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] placeholder:!text-gray-400"
                                        />
                                    ))}
                                </div>
                                {pinError && <p className="!text-red-500 !text-xs !font-bold !mt-4 !text-center animate-pulse !drop-shadow-sm">{pinError}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="!flex !gap-3 !pt-2">
                                <button onClick={() => setIsPickupModalOpen(false)} className="!flex-1 !py-4 !rounded-2xl !font-bold !text-gray-700 !bg-gray-100 hover:!bg-gray-200 !border-2 !border-gray-200 !shadow-sm hover:!shadow-md !transition-all !uppercase !tracking-widest !text-xs">
                                    Cancel
                                </button>
                                <button onClick={handleConfirmPickup} className="!flex-1 !py-4 !rounded-2xl !font-bold !text-white !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !shadow-[0_8px_20px_rgba(181,34,34,0.3)] hover:!shadow-[0_12px_25px_rgba(181,34,34,0.4)] hover:!-translate-y-0.5 active:!translate-y-0 !transition-all !uppercase !tracking-widest !text-xs !border !border-[#B52222]/50">
                                    Verify & Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface OrderManagementProps { }

const OrderManagement: React.FC<OrderManagementProps> = () => {
    const [canteenId, setCanteenId] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const updateOrderStatus = useCallback(async (orderId: string, newFrontendStatus: OrderStatus) => {
        if (!canteenId) {
            alert("Error: Canteen ID is not set. Cannot update order.");
            return;
        }

        const newDbStatus = newFrontendStatus === 'ready' ? 'ready_for_pickup' :
            newFrontendStatus === 'picked_up' ? 'delivered' :
                newFrontendStatus;

        const oldOrders = orders;
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newFrontendStatus } : o));

        try {
            const response = await fetch(`/admin/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newStatus: newDbStatus })
            });

            if (!response.ok) {
                setOrders(oldOrders);
                const errorData = await response.json();
                alert(`Failed to update status: ${errorData.error}`);
            } else {
                await fetchOrders(canteenId);
            }
        } catch (error) {
            console.error("Network error during status update:", error);
            setOrders(oldOrders);
            alert("Network error. Status not updated.");
        }
    }, [orders, canteenId]);


    const fetchOrders = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/api/orders?canteenId=${id}`);
            const data = await response.json();

            if (response.ok && data.orders) {
                setOrders(data.orders);
            } else {
                console.error("Error fetching orders:", data.error);
                setOrders([]);
            }
        } catch (error) {
            console.error("Network error during fetch:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedCanteenId = localStorage.getItem('canteen_id');
        if (storedCanteenId) {
            setCanteenId(storedCanteenId);
            fetchOrders(storedCanteenId);
        } else {
            console.error("Canteen ID not found in localStorage. Seller dashboard cannot load.");
            setLoading(false);
        }
    }, [fetchOrders]);

    return (
        <div className="!max-w-7xl !mx-auto !flex !flex-col !gap-8 !pb-12">
            <div className="!text-center !mb-4">
                <h3 className="!text-3xl md:!text-4xl !font-extrabold !text-gray-900 !tracking-tight">Current Active Orders</h3>
                <p className="!text-gray-500 !font-medium !mt-2">Manage and update the status of your canteen orders</p>
            </div>

            {!canteenId && !loading && (
                <div className="!bg-red-50 !border-l-4 !border-red-500 !p-4 !rounded-r-xl !max-w-2xl !mx-auto">
                    <p className="!text-red-700 !font-bold">Please ensure you are logged in as a seller with a registered Canteen ID.</p>
                </div>
            )}

            <div className="!flex !flex-col !gap-6">
                {loading ? (
                    <div className="!col-span-full !py-20 !flex !flex-col !items-center !justify-center">
                        <div className="!w-12 !h-12 !border-4 !border-gray-200 !border-t-[#B52222] !rounded-full !animate-spin !mb-4"></div>
                        <p className="!text-gray-500 !font-semibold !animate-pulse">Fetching live orders...</p>
                    </div>
                ) : orders.filter(o => !['picked_up', 'pending', 'cancelled'].includes(o.status)).length > 0 ? (
                    orders.filter(o => !['picked_up', 'pending', 'cancelled'].includes(o.status)).map(order =>
                        <OrderCard
                            key={order.id}
                            order={order}
                            updateOrderStatus={updateOrderStatus}
                        />
                    )
                ) : (
                    <div className="!col-span-full !bg-white/60 !backdrop-blur-xl !p-12 !rounded-3xl !border !border-white/60 !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !text-center !flex !flex-col !items-center !justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="!h-20 !w-20 !text-green-500 !mb-6 !opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="!text-2xl !font-extrabold !text-gray-900 !mb-2">All Caught Up!</h4>
                        <p className="!text-gray-500 !text-lg !font-medium">Hooray! No active orders currently awaiting processing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;