import { useState, useCallback, useEffect } from "react";
import { Order, OrderStatus } from "./OrderManagement";

interface OrderRequestsProps {
    canteenId: string;
}

const RequestCard: React.FC<{ order: Order; updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void> }> = ({ order, updateOrderStatus }) => {
    return (
        <div className="!bg-white/80 !backdrop-blur-xl !p-6 !rounded-2xl !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !flex !flex-col !border !border-white/60 !relative !overflow-hidden !transition-transform hover:!-translate-y-1 !duration-300">
            {/* Status Indicator Bar */}
            <div className={`!absolute !left-0 !top-0 !bottom-0 !w-1.5 !bg-[#B52222]`} />

            {/* Header & Status */}
            <div className="!flex !justify-between !items-start !mb-4 !pb-4 !border-b !border-gray-100">
                <div>
                    <h4 className="!text-xl !font-black !text-gray-900 !font-serif !tracking-tight">Request #{order.id.substring(0, 8).toUpperCase()}</h4>
                    <div className="!mt-2 !inline-flex !items-center !px-3 !py-1 !rounded-full !bg-[#B52222] !text-white !text-xs !font-bold !uppercase !tracking-wider !shadow-sm">
                        New Request
                    </div>
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
                <h5 className="!text-xs !font-black !text-gray-400 !uppercase !tracking-wider !mb-3">Requested Items</h5>
                <ul className="!space-y-3 !mb-4">
                    {order.items.map((item, index) => (
                        <li key={index} className="!text-sm !font-semibold !text-gray-700 !flex !flex-col !gap-1">
                            <div className="!flex !items-start">
                                <span className="!text-[#B52222] !mr-2 !mt-0.5">•</span> 
                                <span>{item.name} <span className="!text-gray-400 !ml-1">x {item.quantity}</span></span>
                            </div>
                            {item.special_instructions && (
                                <div className="!pl-4 !ml-1.5 !border-l-2 !border-amber-200 !text-xs !italic !text-amber-700 !bg-amber-50/50 !p-1.5 !rounded-r-md">
                                    <span className="!font-bold !not-italic !mr-1">Note:</span>
                                    {item.special_instructions}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="!mt-4 !text-sm !font-medium !flex !flex-col !gap-2 !bg-gray-50/50 !p-3 !rounded-xl">
                    <div className="!flex !justify-between !border-b !border-gray-200 !pb-2">
                        <span className="!text-gray-500">Pick-up Time</span>
                        <span className="!font-bold !text-gray-900">{order.pickup_time}</span>
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

            {/* Action Buttons */}
            <div className="!mt-6 !flex !gap-3">
                <button onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="!flex-1 !py-3 !bg-white !text-red-500 !font-bold !rounded-xl !transition-all !duration-300 !border !border-red-200 hover:!bg-red-50 hover:!border-red-300 !flex !justify-center !items-center !gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="!h-5 !w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                </button>
                <button onClick={() => updateOrderStatus(order.id, 'accepted')}
                    className="!flex-1 !py-3 !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !transition-all !duration-300 active:!scale-[0.98] animate-mild-breathe !flex !justify-center !items-center !gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="!h-5 !w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                </button>
            </div>
        </div>
    );
};

const OrderRequests: React.FC<OrderRequestsProps> = ({ canteenId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const updateOrderStatus = useCallback(async (orderId: string, newFrontendStatus: OrderStatus) => {
        if (!canteenId) return;

        // Since DB doesn't have pending/accepted flow correctly mapped, 
        // accepting a request directly moves it to 'preparing' in the DB.
        const newDbStatus = newFrontendStatus === 'accepted' ? 'preparing' : 'cancelled';

        const oldOrders = orders;
        setOrders(orders.filter(o => o.id !== orderId));

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
                setOrders([]);
            }
        } catch (error) {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (canteenId) {
            fetchOrders(canteenId);
        }
    }, [canteenId, fetchOrders]);

    const pendingOrders = orders.filter(o => o.status === 'pending');

    return (
        <div className="!max-w-7xl !mx-auto !flex !flex-col !gap-8 !pb-12">
            <div className="!text-center !mb-4">
                <h3 className="!text-3xl md:!text-4xl !font-extrabold !text-gray-900 !tracking-tight">New Order Requests</h3>
                <p className="!text-gray-500 !font-medium !mt-2">Review and accept new incoming orders for your canteen</p>
            </div>

            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 !gap-6">
                {loading ? (
                    <div className="!col-span-full !py-20 !flex !flex-col !items-center !justify-center">
                        <div className="!w-12 !h-12 !border-4 !border-gray-200 !border-t-amber-500 !rounded-full !animate-spin !mb-4"></div>
                        <p className="!text-gray-500 !font-semibold !animate-pulse">Checking for new requests...</p>
                    </div>
                ) : pendingOrders.length > 0 ? (
                    pendingOrders.map(order =>
                        <RequestCard
                            key={order.id}
                            order={order}
                            updateOrderStatus={updateOrderStatus}
                        />
                    )
                ) : (
                    <div className="!col-span-full !bg-white/60 !backdrop-blur-xl !p-12 !rounded-3xl !border !border-white/60 !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !text-center !flex !flex-col !items-center !justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="!h-20 !w-20 !text-gray-300 !mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h4 className="!text-2xl !font-extrabold !text-gray-900 !mb-2">No New Requests</h4>
                        <p className="!text-gray-500 !text-lg !font-medium">You have caught up with all incoming orders.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderRequests;
