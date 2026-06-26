"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";

export default function FoodModal() {
  const { selectedFoodForModal, closeFoodModal, addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  // Reset state when modal opens for a new food item
  useEffect(() => {
    if (selectedFoodForModal) {
      setQuantity(1);
      setInstructions("");
    }
  }, [selectedFoodForModal]);

  if (!selectedFoodForModal) {
    return null; // Don't render if no food is selected
  }

  const { id, name, description, price, image, currency = "LKR", available = true } = selectedFoodForModal;

  const handleConfirmAddToCart = (e: React.MouseEvent) => {
    if (!available) return;

    // --- Flying Animation Logic ---
    const cartIcon = document.getElementById("header-cart-icon");
    if (cartIcon && image) {
      const btnRect = e.currentTarget.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const dot = document.createElement("div");
      dot.style.position = "fixed";
      // Start near the button's center
      dot.style.left = `${btnRect.left + btnRect.width / 2 - 25}px`;
      dot.style.top = `${btnRect.top + btnRect.height / 2 - 25}px`;
      dot.style.width = "50px";
      dot.style.height = "50px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundImage = `url(${image})`;
      dot.style.backgroundSize = "cover";
      dot.style.backgroundPosition = "center";
      dot.style.zIndex = "999999";
      dot.style.pointerEvents = "none";
      dot.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
      dot.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      document.body.appendChild(dot);

      // Use requestAnimationFrame to ensure the browser paints the starting position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Fly to the cart icon
          dot.style.left = `${cartRect.left + cartRect.width / 2 - 15}px`;
          dot.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`;
          dot.style.transform = "scale(0.3) rotate(360deg)";
          dot.style.opacity = "0.7";
        });
      });

      // Cleanup flying dot after animation
      setTimeout(() => {
        if (document.body.contains(dot)) {
          document.body.removeChild(dot);
        }
      }, 800);
    }
    // ------------------------------

    addToCart({ 
      id, 
      name, 
      price, 
      image, 
      quantity,
      specialInstructions: instructions.trim() !== "" ? instructions.trim() : undefined
    });

    closeFoodModal();
  };

  return (
    <>
      <style>{`
        @keyframes modalOverlayFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalContentPop {
          0%   { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .food-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modalOverlayFade 0.3s ease-out forwards;
        }
        
        .food-modal-content {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.2) inset;
          animation: modalContentPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .food-modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          color: #333;
        }
        .food-modal-close-btn:hover {
          background: #ffffff;
          transform: scale(1.1);
          color: #B52222;
        }

        .food-modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          color: #0f172a;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .qty-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }
        .qty-btn:active {
          transform: translateY(1px);
        }

        .special-instructions-input {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.95rem;
          color: #334155;
          min-height: 90px;
          resize: none;
          outline: none;
          transition: all 0.25s ease;
        }
        .special-instructions-input::placeholder {
          color: #94a3b8;
        }
        .special-instructions-input:focus {
          border-color: #B52222;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(181, 34, 34, 0.1);
        }

        .add-to-cart-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #B52222 0%, #d43131 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(181, 34, 34, 0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .add-to-cart-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(181, 34, 34, 0.45);
        }
        .add-to-cart-btn:hover::after {
          opacity: 1;
        }
        .add-to-cart-btn:active {
          transform: translateY(2px);
          box-shadow: 0 4px 12px rgba(181, 34, 34, 0.3);
        }
      `}</style>

      <div className="food-modal-overlay" onClick={closeFoodModal}>
        <div 
          className="food-modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="food-modal-close-btn" onClick={closeFoodModal} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Modal Image */}
          <div style={{ height: "180px", width: "100%", position: "relative", flexShrink: 0 }}>
            <img 
              src={image || "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80"} 
              alt={name} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            {/* Elegant dark gradient overlay for text readability if needed, or just style */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%)"
            }}/>
          </div>

          {/* Modal Body */}
          <div className="food-modal-body" style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 8px 0",
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: "-0.01em",
                lineHeight: 1.2
              }}>
                {name}
              </h3>
              
              <p style={{
                fontSize: "0.95rem",
                color: "#64748b",
                lineHeight: 1.6,
                margin: 0
              }}>
                {description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              padding: "16px 0",
              borderTop: "1px solid #f1f5f9",
              borderBottom: "1px solid #f1f5f9",
              marginBottom: "24px"
            }}>
              <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.05rem" }}>Quantity</span>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                background: "#f1f5f9", 
                borderRadius: "16px",
                padding: "4px"
              }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <span style={{ width: "48px", textAlign: "center", fontWeight: 700, color: "#0f172a", fontSize: "1.1rem" }}>
                  {quantity}
                </span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center",
                gap: "8px",
                fontWeight: 600, 
                color: "#475569", 
                marginBottom: "10px", 
                fontSize: "0.95rem" 
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                Special Instructions
              </label>
              <textarea
                className="special-instructions-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Less spicy, no onions, extra sauce..."
              />
            </div>

            {/* Total and Confirm Add Button */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px"
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>Total Price</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111" }}>
                  {currency} {(price * quantity).toFixed(0)}
                </div>
              </div>

              <button className="add-to-cart-btn" onClick={handleConfirmAddToCart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
