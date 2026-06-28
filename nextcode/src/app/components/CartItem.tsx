import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from './CartContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  canteen: string;
  quantity: number;
  imageSrc: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, canteen = "", imageSrc = "" }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className="!flex !items-center !justify-between !bg-white/60 !backdrop-blur-md !rounded-2xl !border !border-gray-200/60 !shadow-sm !p-3 !w-full !transition-all hover:!bg-white/80">
      
      {/* Left side: Image and Details */}
      <div className="!flex !items-center !gap-3 sm:!gap-4 !flex-1 !min-w-0">
        <div className="!w-[65px] !h-[65px] sm:!w-[75px] sm:!h-[75px] !rounded-xl !overflow-hidden !shrink-0 !bg-gray-100">
          <img src={imageSrc} alt={name} className="!w-full !h-full !object-cover" />
        </div>
        
        <div className="!flex !flex-col !justify-center !min-w-0">
          <h4 className="!font-bold !text-gray-900 !text-[15px] !truncate !m-0">{name}</h4>
          <p className="!text-[12px] !text-gray-500 !font-medium !mt-0.5 !mb-0 !truncate">{canteen}</p>
          <div className="!text-[14px] !font-extrabold !text-gray-900 !mt-1 sm:hidden">
            Rs. {(price * quantity).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Right side: Price and Controls */}
      <div className="!flex !items-center !gap-3 sm:!gap-5 !shrink-0">
        <div className="hidden sm:!block !text-[15px] !font-extrabold !text-gray-900">
          Rs. {(price * quantity).toFixed(2)}
        </div>

        {/* Quantity Controls */}
        <div className="!flex !items-center !bg-white !border !border-gray-200 !rounded-full !px-2 !py-1 !shadow-sm !gap-2">
          <button 
            onClick={() => decreaseQuantity(id)}
            className="!text-gray-600 hover:!text-[#B52222] !font-bold !px-1 sm:!px-1.5 !cursor-pointer !border-none !bg-transparent"
          >
            &minus;
          </button>
          <span className="!font-bold !text-[13px] !text-gray-900 !w-4 !text-center !select-none !m-0">
            {quantity}
          </span>
          <button 
            onClick={() => increaseQuantity(id)}
            className="!text-gray-600 hover:!text-[#B52222] !font-bold !px-1 sm:!px-1.5 !cursor-pointer !border-none !bg-transparent"
          >
            +
          </button>
        </div>

        {/* Delete Button */}
        <button 
          onClick={() => removeFromCart(id)}
          className="!w-8 !h-8 !flex !items-center !justify-center !text-gray-400 hover:!text-[#B52222] hover:!bg-red-50 !rounded-full !transition-colors !cursor-pointer !border-none !bg-transparent"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;