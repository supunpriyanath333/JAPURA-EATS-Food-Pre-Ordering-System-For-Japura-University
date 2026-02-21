// src/app/checkout/components/CartItem.tsx
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  canteen: string;
  quantity: number;
  imageSrc: string;
}

const CartItem: React.FC<CartItemProps> = ({id, name, price, quantity, canteen="", imageSrc="" }) => {
  const RED_COLOR = '#B52222';
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  // Handlers for buttons
  const handleRemove = () => removeFromCart(id);
  const handleIncrease = () => increaseQuantity(id);
  const handleDecrease = () => decreaseQuantity(id);

  return (
    <div 
      // Main container: Image and details stack vertically on small screens, align horizontally on medium screens and up.
      className="flex flex-col md:flex-row items-start md:items-center space-x-4 border-b last:border-b-0" 
      style={{ padding: '1rem 0' }} 
    >
      {/* Image and Details Container */}
      <div className="flex items-start flex-grow">
        {/* Image */}
        <div 
          className="w-20 h-20 flex-shrink-0 rounded overflow-hidden shadow-sm" 
          style={{ width: '5rem', height: '5rem', marginRight: '1rem' }}
        >
          <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div style={{ paddingRight: '1rem' }}> 
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{canteen}</p>
        </div>
      </div>


      {/* Price and Quantity Controls */}
      {/* This section is the most critical for responsiveness.
        - On mobile (default): It takes full width, and its contents (Price and Controls) align vertically.
        - On medium screens (md:): It switches to horizontal alignment (md:flex-row) and justifies space.
      */}
      <div 
        className="flex flex-col md:flex-row md:items-center w-full md:w-auto"
        style={{ 
            marginTop: '1rem', // Space below details on mobile
            gap: '1rem' // Default vertical gap between Price and Controls on mobile
        }}
      >
        {/* Price and Trash (Visible on Mobile/Tablet) */}
        <div className="flex justify-between items-center w-full md:hidden">
            <span className="text-lg font-semibold text-gray-800">Rs. {price.toFixed(2)}</span>
            
            {/* Delete Button (Mobile) */}
            <button 
              onClick={handleRemove}
              className="text-gray-500 hover:text-red-600 transition-colors"
              style={{ color: RED_COLOR }}
              aria-label="Remove item"
            >
              <Trash2 size={20} />
            </button>
        </div>

        {/* Price (Hidden on Mobile, Visible on Desktop) */}
        <span className="text-lg font-semibold text-gray-800 hidden md:block" style={{ marginRight: '1.5rem' }}>Rs. {price.toFixed(2)}</span>

        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-md mx-auto md:mx-0">
          
          {/* Minus Button */}
          <button 
            onClick={handleDecrease}
            className="text-gray-600 hover:bg-gray-100 transition-colors"
            style={{ padding: '0.5rem 0.6rem' }} 
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          
          {/* Quantity Display */}
          <span 
            className="font-medium text-gray-800 select-none border-l border-r border-gray-300"
            style={{ padding: '0.25rem 0.75rem' }} 
          >
            {quantity}
          </span>

          {/* Plus Button */}
          <button 
            onClick={handleIncrease}
            className="text-gray-600 hover:bg-gray-100 transition-colors"
            style={{ padding: '0.5rem 0.6rem' }}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Delete Button (Desktop - Hidden on Mobile) */}
        <button 
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-600 transition-colors hidden md:block"
            style={{ color: RED_COLOR, marginLeft: '1rem' }} 
            aria-label="Remove item"
        >
            <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;