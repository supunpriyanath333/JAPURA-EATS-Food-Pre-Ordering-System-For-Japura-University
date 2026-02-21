import { useState, useCallback, useEffect } from "react";
// Assuming global type definitions are available via this path or similar
// import { Order } from "../../../../global"; 
// Assuming constants and supabase client are imported correctly
import { CARD_BG, PRIMARY_TEXT, SECONDARY_TEXT, JAPURA_EATS_COLOR, RED_COLOR } from "../constants/colors";


// --- Frontend Prop Definitions ---
export type OrderStatus = 'accepted' | 'preparing' | 'ready' | 'picked_up';
export interface Order {
    id: string;
    opt: string;
    status: OrderStatus;
    total: number;
    items: string[]; // e.g., ['Chicken Kottu x 1']
    date: string;
    time: string;
    pickup_time: string;
    payment: 'Card' | 'Cash';
}
// ---

// 🎯 Status flow array defined globally for both helper and component
const STATUS_FLOW: OrderStatus[] = ['accepted', 'preparing', 'ready', 'picked_up'];


// NOTE: The database statuses are used here: pending, accepted, preparing, ready_for_pickup, delivered, cancelled
const STATUS_COLORS: { [key in Order['status'] | 'pending' | 'cancelled']: string } = {
    pending: '#FFC107', // Amber/Yellow
    cancelled: '#EF5350', // Red
    accepted: '#FDD835', // Yellow
    preparing: '#42A5F5', // Blue
    ready: '#66BB6A', // Green
    picked_up: '#BDBDBD', // Grey
};


interface OrderManagementProps {
    // We will now get the canteen ID internally, so this prop can be simplified or removed
    // canteenId: string; 
}

// Helper to determine the next step in the flow
const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    return currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null;
};

// --- OrderCard Component ---
interface OrderCardProps {
    order: Order;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, updateOrderStatus }) => {
    const nextStatus = getNextStatus(order.status);
    const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
    const statusColor = STATUS_COLORS[order.status] || SECONDARY_TEXT;

    const handleUpdateClick = () => {
        if (order.id && nextStatus) {
            updateOrderStatus(order.id, nextStatus);
        } else {
            console.error("Cannot update status: Order ID is invalid or next status is null.");
            alert("Error: Cannot proceed with status update.");
        }
    };

    return (
        <div 
            style={{ 
                backgroundColor: CARD_BG, 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: `6px solid ${statusColor}`, 
                transition: 'transform 0.3s', 
                marginBottom: '1.5rem' 
            }}
        >
            {/* Header & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
                <div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.5rem', color: PRIMARY_TEXT }}>Order #{order.id.substring(0, 8).toUpperCase()}</h4>
                    <span style={{ 
                        display: 'inline-block', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        color: CARD_BG,
                        backgroundColor: statusColor, 
                        marginTop: '0.5rem' 
                    }}>
                        {order.status.replace('_', ' ')}
                    </span>
                </div>
                <span style={{ fontSize: '0.875rem', color: SECONDARY_TEXT, textAlign: 'right' }}>{order.date} @ {order.time}</span>
            </div>
            
            {/* Status Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', margin: '1rem 0' }}>
                {STATUS_FLOW.map((status, index) => {
                    const isComplete = index <= currentStatusIndex;
                    const timelineColor = isComplete ? JAPURA_EATS_COLOR : '#E0E0E0';
                    return (
                        <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* Line (Only visible if not the first element) */}
                                {index > 0 && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            top: '50%', 
                                            transform: 'translateY(-50%) translateX(-50%)',
                                            width: '100%', 
                                            height: '2px', 
                                            backgroundColor: timelineColor,
                                            zIndex: 0, 
                                            left: 0,
                                        }} 
                                    ></div>
                                )}
                                {/* Circle */}
                                <div 
                                    style={{ 
                                        width: '1.75rem', 
                                        height: '1.75rem', 
                                        borderRadius: '9999px', 
                                        border: `2px solid ${timelineColor}`, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        transition: 'all 0.3s', 
                                        position: 'relative', 
                                        zIndex: 10,
                                        backgroundColor: isComplete ? timelineColor : CARD_BG, 
                                        color: isComplete ? CARD_BG : timelineColor 
                                    }}
                                >
                                    {isComplete && (
                                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    )}
                                </div>
                            </div>
                            <p style={{ 
                                marginTop: '0.5rem', 
                                fontSize: '0.75rem', 
                                fontWeight: '500', 
                                textTransform: 'capitalize', 
                                transition: 'color 0.3s',
                                color: isComplete ? PRIMARY_TEXT : SECONDARY_TEXT
                            }}>
                                {status.replace('_', ' ')}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Details */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #F9FAFB', flexGrow: 1 }}>
                <p style={{ fontSize: '3rem', fontWeight: '800', textAlign: 'center', marginBottom: '1rem', color: RED_COLOR }}>{order.opt}</p>
                <h5 style={{ fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Items Ordered:</h5>
                <ul style={{ listStyleType: 'disc', marginLeft: '1rem', paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#4B5563' }}>
                    {order.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', marginTop: '0.5rem', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1rem' }}>
                        <span>Total Amount</span>
                        <span style={{ color: PRIMARY_TEXT }}>Rs. {order.total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: SECONDARY_TEXT }}>Expected Pick Up</span>
                        <span style={{ fontWeight: '600', color: PRIMARY_TEXT }}>{order.pickup_time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: SECONDARY_TEXT }}>Payment Method</span>
                        <span style={{ fontWeight: '600', color: PRIMARY_TEXT }}>{order.payment}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div style={{ marginTop: '1.5rem' }}>
                {nextStatus && (
                    <button
                        onClick={handleUpdateClick}
                        style={{ 
                            width: '100%', 
                            paddingTop: '0.75rem', 
                            paddingBottom: '0.75rem', 
                            color: CARD_BG, 
                            fontWeight: 'bold', 
                            borderRadius: '0.5rem', 
                            transition: 'all 0.3s', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: JAPURA_EATS_COLOR,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                    >
                        MARK AS {nextStatus.toUpperCase().replace('_', ' ')}
                    </button>
                )}
                {order.status === 'picked_up' && (
                    <div style={{ marginTop: '1rem', textAlign: 'center', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 'bold' }}>
                        ORDER COMPLETED
                    </div>
                )}
            </div>
        </div>
    );
};


const OrderManagement: React.FC<OrderManagementProps> = () => {
    // ⚠️ State to store the canteenId retrieved from localStorage
    const [canteenId, setCanteenId] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start loading

    // 2. Update Status Logic (Calls the PATCH API)
    // NOTE: This must be defined BEFORE fetchOrders because fetchOrders uses it
    // to map the incoming data status. No, wait, fetchOrders is just GET.
    // The definition of updateOrderStatus needs to be stable.

    const updateOrderStatus = useCallback(async (orderId: string, newFrontendStatus: OrderStatus) => {
        
        if (!canteenId) {
             alert("Error: Canteen ID is not set. Cannot update order.");
             return;
        }

        // Map frontend status ('ready') back to the database status ('ready_for_pickup')
        const newDbStatus = newFrontendStatus === 'ready' ? 'ready_for_pickup' : 
                            newFrontendStatus === 'picked_up' ? 'delivered' : 
                            newFrontendStatus;

        // Optimistic UI update
        const oldOrders = orders;
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newFrontendStatus } : o));
        
        try {
            const response = await fetch(`/admin/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newStatus: newDbStatus })
            });

            if (!response.ok) {
                // Rollback if API fails
                setOrders(oldOrders); 
                const errorData = await response.json();
                alert(`Failed to update status: ${errorData.error}`);
            } else {
                // Refetch to synchronize and get accurate data
                // We use a simple window.location.reload() or navigate/toast here in a real app.
                // For this example, we call fetchOrders again, but need to pass the canteenId.
                // Since fetchOrders is defined below, we'll refactor the call.
                await fetchOrders(canteenId); 
            }
            
        } catch (error) {
            console.error("Network error during status update:", error);
            setOrders(oldOrders); // Rollback
            alert("Network error. Status not updated.");
        }
    }, [orders, canteenId]); // Added dependencies


    // 1. Fetch Orders Logic (Calls the GET API)
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
    
    // 🎯 INITIAL EFFECT: Retrieve Canteen ID and load orders
    useEffect(() => {
        const storedCanteenId = localStorage.getItem('canteen_id');
        if (storedCanteenId) {
            setCanteenId(storedCanteenId);
            fetchOrders(storedCanteenId);
        } else {
            console.error("Canteen ID not found in localStorage. Seller dashboard cannot load.");
            setLoading(false);
        }
    }, [fetchOrders]); // Dependency on fetchOrders only

    
    return (
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.875rem', fontWeight: '800', color: PRIMARY_TEXT, textAlign: 'center' }}>Current Active Orders</h3>
            {!canteenId && !loading && (
                 <p style={{ textAlign: 'center', color: RED_COLOR }}>Please ensure you are logged in as a seller with a registered Canteen ID.</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: 'span 2', fontSize: '1.125rem', color: SECONDARY_TEXT }}>Fetching live orders...</p>
                ) : orders.filter(o => o.status !== 'picked_up').length > 0 ? (
                    orders.filter(o => o.status !== 'picked_up').map(order => 
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            updateOrderStatus={updateOrderStatus} 
                        />
                    )
                ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', backgroundColor: CARD_BG, padding: '2.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                           <p style={{ color: SECONDARY_TEXT, fontSize: '1.125rem' }}>Hooray! No active orders currently awaiting processing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;