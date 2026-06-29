import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// --- INTERFACES ---
export type OrderStatus = "Order Accepted" | "Preparing" | "Ready to Pick up" | "Picked up";
export type OrderType = "Active Orders" | "Order History";

export interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

export interface OrderFeedback {
  rating: number;
  comment?: string;
}

export interface Order {
  id: string;
  canteenName: string;
  canteenId?: string;
  date: string;
  time: string;
  status: OrderStatus[];
  otp?: string;
  items: OrderItem[];
  total: number;
  pickUpTime: string;
  paymentMethod: "Online" | "Cash" | "Card";
  diningOption: string;
  feedback?: OrderFeedback;
  isPickedUp?: boolean;
  createdAt?: string;
  rawStatus?: string;
  refundEligible?: boolean;
  dbId?: string;
}

export default function OrderCard({ order, isHistory = false }: { order: Order; isHistory?: boolean }) {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const statusSteps: OrderStatus[] = ["Order Accepted", "Preparing", "Ready to Pick up", "Picked up"];
  const currentStatusIndex = statusSteps.findIndex(
    (step) => step === order.status[order.status.length - 1]
  );
  // Ensure index is valid for coloring (0 for "Order Accepted" if not found higher)
  const validCurrentStatusIndex = Math.max(currentStatusIndex, 0);

  const router = useRouter();

  const handleOrderAgain = () => {
    if (order.canteenId) {
      router.push(`/canteen/${order.canteenId}`);
    }
  };

  const handleCancelOrder = async () => {
    if (!order.dbId) return;
    if (!confirm("Are you sure you want to cancel this order? If eligible, a refund will be processed.")) return;

    // Get session for authorization
    const sessionString = localStorage.getItem("supabase_session");
    if (!sessionString) {
      alert("Please log in again to cancel the order.");
      return;
    }
    let userEmail = "";
    try {
      const sessionData = JSON.parse(sessionString);
      userEmail = sessionData.user?.email;
    } catch (e) {
      alert("Session error. Please log in again.");
      return;
    }
    if (!userEmail) {
      alert("User email not found. Please log in again.");
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch('/api/order/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': userEmail
        },
        body: JSON.stringify({ orderId: order.dbId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      alert(data.message);
      window.location.reload();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = React.useMemo(() => {
    if (isHistory || order.rawStatus === 'cancelled') return false;
    if (order.rawStatus === 'preparing' || order.rawStatus === 'ready_for_pickup' || order.rawStatus === 'delivered') return false;
    return true;
  }, [order, isHistory]);

  return (
    <div className={`!bg-white/70 !backdrop-blur-xl !rounded-xl !border !border-white/60 !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !p-5 !mb-6 ${inter.className}`}>
      <style>{`
        @keyframes arrowWidth {
          0% { width: 60%; opacity: 0.4; }
          50% { width: 100%; opacity: 1; }
          100% { width: 60%; opacity: 0.4; }
        }
        .anim-width {
          animation: arrowWidth 1.5s ease-in-out infinite !important;
        }
      `}</style>

      {/* Header */}
      <div className="!flex !justify-between !items-start !mb-5">
        <div>
          <h3 className="!text-[18px] !font-bold !text-black !mb-0.5">
            {order.canteenId ? (
              <Link href={`/canteen/${order.canteenId}`} className="hover:!underline !cursor-pointer">
                {order.canteenName}
              </Link>
            ) : (
              order.canteenName
            )}
          </h3>
          <p className="!text-[13px] !font-medium !text-gray-500">
            {order.date} • {order.time}
          </p>
        </div>
        <div className="!text-right">
          <span className="!text-[14px] !font-bold !text-gray-700">Order ID</span>
          <p className="!text-[15px] !font-bold !text-black">#{order.id}</p>
        </div>
      </div>

      {/* Status Indicator (History Mode) */}
      {isHistory && (
        <div className="!flex !items-center !gap-2 !mb-4">
          {order.rawStatus === 'cancelled' ? (
            <>
              <svg className="!w-[20px] !h-[20px] !text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="!text-[15px] !font-bold !text-red-600">Cancelled</span>
            </>
          ) : (
            <>
              <svg className="!w-5 !h-5 !text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="!text-[15px] !font-bold !text-[#22c55e]">Picked up</span>
            </>
          )}
        </div>
      )}

      {/* Progress Tracker (Active Orders) */}
      {!isHistory && (
        <div className="!bg-gray-50 !border !border-gray-200 !rounded-lg !p-5 !mb-5 !flex !flex-col !justify-center">
          <div className="!flex !items-center !justify-between !max-w-5xl !mx-auto !w-full !gap-2 sm:!gap-4 lg:!gap-6">
            {statusSteps.map((step, index) => {
              const isActive = index <= validCurrentStatusIndex;
              const isCurrent = index === validCurrentStatusIndex;

              return (
                <React.Fragment key={step}>
                  <div className="!flex !items-center !gap-1.5 sm:!gap-3 !flex-shrink-0">
                    {/* Icon */}
                    {step === "Order Accepted" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-green-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5 sm:!w-6 sm:!h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    )}
                    {step === "Preparing" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-green-500' : '!text-gray-400'}`}>
                        <svg className={`!w-5 !h-5 sm:!w-6 sm:!h-6 ${isCurrent ? '!animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                    )}
                    {step === "Ready to Pick up" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-gray-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5 sm:!w-6 sm:!h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                    )}
                    {step === "Picked up" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-gray-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5 sm:!w-6 sm:!h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </div>
                    )}

                    {/* Text */}
                    <span className={`!text-[14px] sm:!text-[15.5px] !whitespace-nowrap ${isActive ? '!font-bold !text-black' : '!font-medium !text-gray-400'}`}>
                      {step}
                    </span>
                  </div>

                  {/* Line */}
                  {index < statusSteps.length - 1 && (
                    <div className="!flex-1 !mx-2 sm:!mx-4 lg:!mx-6 !relative !flex !items-center !justify-start !min-w-[30px] sm:!min-w-[50px]">
                      <div className={`!relative !flex !items-center ${isCurrent ? 'anim-width' : '!w-full'}`}>
                        <div className={`!w-full !h-[2px] !rounded-full ${isActive ? '!bg-green-500' : '!bg-gray-400'}`}></div>
                        <svg
                          className={`!w-5 !h-5 !absolute !right-[-8px] ${isActive ? '!text-green-500' : '!text-gray-400'}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="!text-center !mt-6">
            <span className="!text-[15px] !font-bold !text-black">
              Your PIN - <span className="!text-red-600 !tracking-wide">{order.otp}</span>
            </span>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="!flex !flex-col !gap-3 !mb-5">
        {order.items.map((item, index) => (
          <div key={index} className="!flex !justify-between !items-center">
            <span className="!text-[14px] !font-bold !text-black">
              {item.quantity} x {item.name}
            </span>
            <span className="!text-[14px] !font-bold !text-black">
              Rs. {item.price}
            </span>
          </div>
        ))}
      </div>

      <hr className="!border-gray-200 !mb-4" />

      {/* Summary */}
      <div className="!flex !flex-col !gap-2.5">
        <div className="!flex !justify-between !items-center">
          <span className="!text-[14px] !font-medium !text-gray-700">Total</span>
          <span className="!text-[14px] !font-bold !text-black">Rs. {order.total}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-[14px] !font-medium !text-gray-700">Pick Up Time</span>
          <span className="!text-[14px] !font-medium !text-black">{order.pickUpTime}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-[14px] !font-medium !text-gray-700">Dining Option</span>
          <span className="!text-[14px] !font-medium !text-black">{order.diningOption}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-[14px] !font-medium !text-gray-700">Payment</span>
          <span className="!text-[14px] !font-medium !text-black">{order.paymentMethod}</span>
        </div>
      </div>
      {/* Active Orders Actions */}
      {!isHistory && (
        <div className="!mt-5 !pt-4 !border-t !border-gray-200">
          {order.rawStatus === 'cancelled' ? (
            <div className="!flex !flex-col !gap-1 !items-center !justify-center !py-2">
              <span className="!text-red-600 !font-bold !text-[15px]">Order Cancelled</span>
              {order.refundEligible && (
                <span className="!text-green-600 !text-sm !font-semibold">Refund Eligible</span>
              )}
            </div>
          ) : canCancel ? (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className={`${inter.className} !w-full !bg-white !text-red-600 !border-2 !border-red-600 !font-semibold !rounded-xl !py-3
                        hover:!bg-red-50 active:!scale-[0.98] !transition-all !duration-200 !text-center disabled:!opacity-50 !cursor-pointer disabled:!cursor-not-allowed`}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          ) : (
            <div className="!text-center !py-2">
              <span className="!text-gray-400 !text-sm">
                Order is preparing or already prepared, cannot be cancelled.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Feedback Section - Only for Order History */}
      {isHistory && (
        <div className="!mt-5 !mb-2 !flex !items-stretch !justify-between !gap-4">
          {/* Feedback Box */}
          <div className="!flex-1 !bg-gray-100 !border !border-gray-300 !rounded-lg !px-3 !py-2">
            {order.feedback ? (
              <div className="!flex !flex-col !gap-1 !py-0">
                {/* Stars */}
                <div className="!flex !items-center !gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`!w-5 !h-5 ${star <= order.feedback!.rating
                        ? "!fill-yellow-400 !text-yellow-400"
                        : "!fill-gray-300 !text-gray-300"
                        }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                {order.feedback.comment && (
                  <p className={`${inter.className} !text-sm !text-gray-700`}>
                    {order.feedback.comment}
                  </p>
                )}
              </div>
            ) : (
              // No feedback yet
              <div className="!flex !items-center !gap-2 !py-1 !justify-center">
                <svg
                  className="!w-5 !h-5 !text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>

                <span className={`${inter.className} !text-sm !text-gray-600`}>
                  Leave a Feedback
                </span>
              </div>
            )}
          </div>

          {/* Order Again Button */}
          <button
            onClick={handleOrderAgain}
            className={`${inter.className} !bg-[#B52222] !text-white !font-semibold !rounded-lg !px-20 !py-2.5
                      hover:!bg-[#9a1e1e] active:!scale-[0.98] !transition-all !duration-200 !text-center !cursor-pointer`}
          >
            Order Again
          </button>
        </div>
      )}
    </div>
  );
}
