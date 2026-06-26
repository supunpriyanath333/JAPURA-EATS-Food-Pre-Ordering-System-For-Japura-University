"use client";

import React, { useState, use, useEffect } from "react";
import { Header, FoodCard } from "../../components";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image?: string;
  currency?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
  available: boolean;
  image_url?: string;
}

interface FoodGrouped {
  breakfast: FoodCardProps[];
  lunch: FoodCardProps[];
  dinner: FoodCardProps[];
}

interface CanteenProps {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  phone: string;
  imageUrl: string;
  isOpen?: boolean;
  operatingHours?: {
    breakfast: { start: string; end: string };
    lunch: { start: string; end: string };
    dinner: { start: string; end: string };
  };
}

export default function CanteenPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const canteenId = resolvedParams.id;
  const [error, setError] = useState<string | null>(null);
  const [canteenData, setCanteenData] = useState<CanteenProps>();
  const getCurrentOrderMeal = (): MealType => {
    const now = new Date();
    const hours = now.getHours();

    // Breakfast orders: 5:00 PM (17:00) – 6:00 AM (06:00) next day
    if (hours >= 17 || hours < 6) return "BREAKFAST";

    // Lunch orders: 6:00 AM – 11:00 AM
    if (hours >= 6 && hours < 11) return "LUNCH";

    // Dinner orders: 11:00 AM – 5:00 PM
    return "DINNER";
  };

  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST");
  const [currentOrderMeal, setCurrentOrderMeal] = useState<MealType>("BREAKFAST");

  // Set the meal type on mount to avoid hydration mismatch if SSR is used
  useEffect(() => {
    const meal = getCurrentOrderMeal();
    setCurrentOrderMeal(meal);
    setSelectedMealType(meal);
  }, []);

  const [foods, setFoods] = useState<FoodGrouped>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  useEffect(() => {
    if (!canteenId) return;

    const fetchCanteenAndFoods = async () => {
      setLoading(true);
      setError(null);

      try {
        const canteenRes = await fetch(`/api/canteens/${canteenId}`);
        if (!canteenRes.ok) throw new Error("Failed to fetch canteen details");
        const canteenData: CanteenProps = await canteenRes.json();
        setCanteenData(canteenData);

        const foodsRes = await fetch(`/api/canteens/${canteenId}/foods`);
        if (!foodsRes.ok) throw new Error("Failed to fetch foods");
        const foodsData: FoodGrouped = await foodsRes.json();
        setFoods(foodsData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteenAndFoods();
  }, [canteenId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: '#B52222', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (error) return <p style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</p>;
  if (!canteenData) return null;

  const isOpen = canteenData.isOpen !== false;
  const canOrder = selectedMealType === currentOrderMeal;

  const getOrderTimeDisplay = (meal: MealType) => {
    switch (meal) {
      case "BREAKFAST": return "5:00 PM to 6:00 AM (next day)";
      case "LUNCH": return "6:00 AM to 11:00 AM";
      case "DINNER": return "11:00 AM to 5:00 PM";
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* ── Canteen Info Section (Glass UI Card) ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '2.5rem 0 1rem' }}>
        <div className="container mx-auto px-4">
          <div style={{
            background: 'rgba(255, 255, 255, 0.45)', // Glass background
            backdropFilter: 'blur(28px)', // Strong blur
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.8)', // Frosty border
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
            borderRadius: '24px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>

              {/* Image */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src={canteenData.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"}
                  alt={canteenData.name}
                  style={{
                    width: '220px', height: '220px', objectFit: 'cover',
                    borderRadius: '20px', border: '3px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  {/* Left side info */}
                  <div>
                    <h1 className={inter.className} style={{
                      fontSize: '2rem', fontWeight: 800, color: '#111',
                      margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.03em'
                    }}>
                      {canteenData.name}
                    </h1>

                    {canteenData.description && (
                      <p className={inter.className} style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '12px', lineHeight: 1.5 }}>
                        {canteenData.description}
                      </p>
                    )}

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.9rem', color: '#374151' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B52222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style={{ fontWeight: 600 }}>{canteenData.location}</span>
                    </div>

                    {/* Open/Closed */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                      <span style={{ color: isOpen ? '#16a34a' : '#ef4444', fontSize: '1rem' }}>●</span>
                      <span style={{ color: isOpen ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                        {isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Rating & Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    {/* Rating (Glass Badge) */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px', padding: '8px 16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="#f59e0b">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#92400e' }}>
                        {canteenData.rating?.toFixed(1) ?? "—"}
                      </span>
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500, marginTop: '30px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 012.05 2 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0120 17.92z" />
                      </svg>
                      <span>{canteenData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{
                  display: 'flex', gap: '17rem', marginTop: '24px', paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.7)', flexWrap: 'wrap',
                }}>
                  {[
                    { label: 'Breakfast', hours: canteenData.operatingHours?.breakfast || { start: '7:00 AM', end: '11:00 AM' } },
                    { label: 'Lunch', hours: canteenData.operatingHours?.lunch || { start: '11:30 AM', end: '3:00 PM' } },
                    { label: 'Dinner', hours: canteenData.operatingHours?.dinner || { start: '5:30 PM', end: '8:30 PM' } },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B52222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={inter.className} style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', lineHeight: 1.2 }}>
                          {item.label}
                        </span>
                        <span className={inter.className} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginTop: '2px' }}>
                          {item.hours.start} - {item.hours.end}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meal Type Tabs (Glass UI Pill) ── */}
      <section style={{
        position: 'sticky', top: '70px', zIndex: 30, padding: '0 0 16px 0',
      }}>
        <div className="container mx-auto px-4" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px', padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 24px rgba(31, 38, 135, 0.08), inset 0 2px 4px rgba(255,255,255,0.5)'
          }}>
            {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((mealType) => {
              const isActive = selectedMealType === mealType;
              return (
                <button
                  key={mealType}
                  onClick={() => setSelectedMealType(mealType)}
                  className={inter.className}
                  style={{
                    padding: '10px 28px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#B52222' : 'transparent',
                    color: isActive ? '#fff' : '#6b7280',
                    boxShadow: isActive ? '0 2px 8px rgba(181,34,34,0.3)' : 'none',
                  }}
                >
                  {mealType}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Menu Grid ── */}
      <section style={{ flex: 1, padding: '1rem 0 4rem' }}>
        <div className="container mx-auto px-4">

          {/* Section heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem', marginTop: '-1rem' }}>
            <h2 className={inter.className} style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
              {selectedMealType.charAt(0) + selectedMealType.slice(1).toLowerCase()} Menu
              {canOrder && <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: 600, marginLeft: '10px' }}>(Available to order now)</span>}
            </h2>
            <div style={{ height: '1px', flex: 1, background: '#e5e7eb' }}></div>
          </div>

          {!canOrder && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <div>
                <h4 style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem', margin: '0 0 4px 0' }}>Not Available for Ordering Right Now</h4>
                <p style={{ margin: 0, color: '#b45309', fontSize: '0.85rem' }}>
                  You can only place orders for {selectedMealType.toLowerCase()} between <strong>{getOrderTimeDisplay(selectedMealType)}</strong>.
                </p>
              </div>
            </div>
          )}

          {foods[selectedMealType.toLowerCase() as keyof FoodGrouped]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods[selectedMealType.toLowerCase() as keyof FoodGrouped].map((food, index) => (
                <div
                  key={food.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <FoodCard 
                    {...food} 
                    onAddToCart={handleAddToCart} 
                    available={canOrder} 
                    canteenId={canteenData.id}
                    canteenName={canteenData.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.4 }}>🍽️</div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#6b7280' }}>No items available for this meal currently.</p>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>Please check back later.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
