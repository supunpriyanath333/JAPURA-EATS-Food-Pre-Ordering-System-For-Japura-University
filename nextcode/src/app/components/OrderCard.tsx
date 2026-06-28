import React from "react";
import Link from "next/link";
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
}

export default function OrderCard({ order, isHistory = false }: { order: Order; isHistory?: boolean }) {
  const statusSteps: OrderStatus[] = ["Order Accepted", "Preparing", "Ready to Pick up", "Picked up"];
  const currentStatusIndex = statusSteps.findIndex(
    (step) => step === order.status[order.status.length - 1]
  );
  // Ensure index is valid for coloring (0 for "Order Accepted" if not found higher)
  const validCurrentStatusIndex = Math.max(currentStatusIndex, 0); 

  const handleOrderAgain = (orderId: string) => {
    console.log("Order again:", orderId);
  };

  return (
    <div className={`!bg-white !rounded-xl !border !border-gray-300 !p-5 !mb-6 ${inter.className}`}>
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
        <div className="!flex !flex-col">
          <h3 className="!text-[15px] !font-bold !text-black !mb-0.5">
            Order ID - {order.id}
          </h3>
          <div className="!text-sm !font-medium !text-gray-600">
            From - {order.canteenId ? (
              <Link href={`/canteen/${order.canteenId}`} className="!text-[#B52222] hover:!underline !cursor-pointer">
                {order.canteenName}
              </Link>
            ) : (
              <span>{order.canteenName}</span>
            )}
          </div>
          {isHistory && (
            <p className="!text-xs !text-gray-500 !mt-1">
              {order.date}, {order.time}
            </p>
          )}
        </div>

        {!isHistory && (
          <div className="!text-right">
            <p className="!text-sm !font-bold !text-black">{order.date}</p>
            <p className="!text-xs !font-medium !text-gray-600">{order.time}</p>
          </div>
        )}
      </div>

      {/* Picked Up Indicator (History Mode) */}
      {isHistory && order.isPickedUp && (
        <div className="!flex !items-center !gap-2 !mb-4">
          <svg className="!w-5 !h-5 !text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="!text-sm !font-bold !text-[#22c55e]">Picked up</span>
        </div>
      )}

      {/* Progress Tracker (Active Orders) */}
      {!isHistory && (
        <div className="!bg-gray-100/70 !border !border-gray-200 !rounded-lg !p-5 !mb-5 !flex !flex-col !justify-center">
          <div className="!flex !items-center !justify-between !max-w-3xl !mx-auto !w-full !gap-1 sm:!gap-2">
            {statusSteps.map((step, index) => {
              const isActive = index <= validCurrentStatusIndex;
              const isCurrent = index === validCurrentStatusIndex;
              
              return (
                <React.Fragment key={step}>
                  <div className="!flex !items-center !gap-1 sm:!gap-2 !flex-shrink-0">
                    {/* Icon */}
                    {step === "Order Accepted" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-green-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    )}
                    {step === "Preparing" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-green-500' : '!text-gray-400'}`}>
                        <svg className={`!w-5 !h-5 ${isCurrent ? '!animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                    )}
                    {step === "Ready to Pick up" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-gray-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                    )}
                    {step === "Picked up" && (
                      <div className={`!flex !items-center !justify-center ${isActive ? '!text-gray-500' : '!text-gray-400'}`}>
                        <svg className="!w-5 !h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                    
                    {/* Text */}
                    <span className={`!text-[12px] sm:!text-[13px] !whitespace-nowrap ${isActive ? '!font-bold !text-black' : '!font-medium !text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  
                  {/* Line */}
                  {index < statusSteps.length - 1 && (
                    <div className="!flex-1 !mx-1 sm:!mx-3 !relative !flex !items-center !justify-start !min-w-[20px]">
                       <div className={`!relative !flex !items-center ${isCurrent ? 'anim-width' : '!w-full'}`}>
                         <div className={`!w-full !h-[2px] !rounded-full ${isActive ? '!bg-green-500' : '!bg-gray-400'}`}></div>
                         <svg 
                           className={`!w-5 !h-5 !absolute !right-[-8px] ${isActive ? '!text-green-500' : '!text-gray-400'}`} 
                           fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
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
      
      {/* Feedback Section - Only for Order History */}
      {isHistory && (
        <div className="!mt-5 !mb-2 !flex !gap-4">
          {/* Feedback Box */}
          <div className="!flex-1 !bg-gray-100 !border !border-gray-300 !rounded-xl !p-4">
            {order.feedback ? (
              <div className="!flex !flex-col !gap-2 !py-1">
                {/* Stars */}
                <div className="!flex !items-center !gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`!w-5 !h-5 ${
                        star <= order.feedback!.rating
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
              <div className="!flex !items-center !gap-2 !py-2 !justify-center">
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
            onClick={() => handleOrderAgain(order.id)}
            className={`${inter.className} !flex-1 !bg-[#B52222] !text-white !font-semibold !rounded-xl !py-3
                      hover:!bg-[#9a1e1e] active:!scale-[0.98] !transition-all !duration-200 !text-center`}
          >
            Order Again
          </button>
        </div>
      )}
    </div>
  );
}
