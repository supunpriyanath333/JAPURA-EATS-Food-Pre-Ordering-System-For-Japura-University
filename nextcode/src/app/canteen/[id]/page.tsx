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
  isOpen?: boolean; // optional, default true
  operatingHours?: {
    breakfast: { start: string; end: string };
    lunch: { start: string; end: string };
    dinner: { start: string; end: string };
  };
}


  // You can also fetch canteen info dynamically here if needed
  // const canteenData: CanteenProps = {
  //   id: "001",
  //   name: "Canteen 0001",
  //   description: "The largest canteen serving authentic Sri Lankan Cuisine.",
  //   location: "Faculty of Management",
  //   rating: 4.7,
  //   isOpen: true,
  //   phone: "+94 77 123 4567",
  //   image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=80",
  //   operatingHours: {
  //     breakfast: { start: "7.00 AM", end: "10.00 AM" },
  //     lunch: { start: "11.00 AM", end: "02.00 PM" },
  //     dinner: { start: "5.30 PM", end: "08.30 PM" },
  //   },
  // };

// Sample data - In a real app, this would come from an API
// const canteenData = {
//   id: "001",
//   name: "Canteen 0001",
//   description: "The largest canteen serving authentic Sri Lankan Cuisine.",
//   location: "Faculty of Management",
//   rating: 4.7,
//   isOpen: true,
//   phone: "+94 77 123 4567",
//   image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=80",
//   operatingHours: {
//     breakfast: { start: "7.00 AM", end: "10.00 AM" },
//     lunch: { start: "11.00 AM", end: "02.00 PM" },
//     dinner: { start: "5.30 PM", end: "08.30 PM" },
//   },
// };

// const menuItems = {
//   BREAKFAST: [
//     {
//       id: "food-001",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-002",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-003",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-004",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-005",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-006",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-007",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//     {
//       id: "food-008",
//       name: "String Hoppers with Curry",
//       description: "Traditional string hoppers served with dhal curry and sumbol",
//       price: 150,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//   ],
//   LUNCH: [
//     {
//       id: "food-101",
//       name: "Rice and Curry",
//       description: "Traditional Sri Lankan rice with mixed curries",
//       price: 200,
//       rating: 4.8,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//   ],
//   DINNER: [
//     {
//       id: "food-201",
//       name: "Kottu Roti",
//       description: "Chopped roti with vegetables and spices",
//       price: 180,
//       rating: 4.6,
//       image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//     },
//   ],
// };

export default function CanteenPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const canteenId = resolvedParams.id;
  const [error, setError] = useState<string | null>(null);
  // State for canteen info and foods
  const [canteenData, setCanteenData] = useState<CanteenProps>();

  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST");
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
        // Fetch canteen details
        const canteenRes = await fetch(`/api/canteens/${canteenId}`);
        if (!canteenRes.ok) throw new Error("Failed to fetch canteen details");
        const canteenData: CanteenProps = await canteenRes.json();
        setCanteenData(canteenData);

        // Fetch foods
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


  
  
   
  const navItems = [
    {
      label: "HOME",
      href: "/",
      isActive: false,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "CANTEENS",
      href: "/canteens",
      isActive: true,
      icon: (
        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "ORDERS",
      href: "/orders",
      isActive: false,
      icon: (
        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!canteenData) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
     

      
      {/* Canteen Information Section */}
<section className="bg-white">
  <div className="container mx-auto px-4">
    <div
      className="rounded-2xl border border-gray-200 shadow-sm bg-white"
      style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Canteen Image */}
        <div>
          <img
            src={canteenData?.imageUrl}
            alt={canteenData?.name}
            className="w-[190px] h-[180px] object-cover rounded-xl border border-gray-200"
          />
        </div>

        {/* Canteen Details */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className={`${inter.className} text-2xl font-bold text-black mb-1`}>
                {canteenData?.name}
              </h1>
              <p className={`${inter.className} text-base text-gray-600 mb-1`}>
                {canteenData?.description}
              </p>
              <div className={`${inter.className} flex items-center gap-2 text-sm text-gray-700 mb-1`}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{canteenData?.location}</span>
              </div>
              <div className={`${inter.className} flex items-center gap-2 text-sm`}>
                <span className="text-[#22c55e] font-medium">●</span>
                <span className="text-[#22c55e] font-medium">
                  {canteenData?.isOpen ?? true ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>

            {/* Rating and Phone */}
            <div className="flex flex-col items-start lg:items-end gap-3">
              <div className="bg-white border border-black rounded-md inline-flex items-center gap-2" style={{ minWidth: "80px", minHeight: "32px", padding: "6px 12px" }}>
                <svg className="w-5 h-5 text-[#F7C948]" fill="#F7C948" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-black font-semibold text-base">
                  {canteenData?.rating.toFixed(1)}
                </span>
              </div>
              <div className={`${inter.className} flex items-center gap-2 text-sm text-gray-700`}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
                </svg>
                <span>{canteenData?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Meal Type Tabs Section */}
<section className="bg-white border-t border-b border-gray-200 py-8">
  <div className="container mx-auto px-4">
    <div className="flex justify-center">
      <div className="inline-flex items-center rounded-full border border-black/20 bg-[rgb(var(--color-hero-bg))]/[0.9] px-4 py-2 shadow-sm">
        {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((mealType) => {
          const isActive = selectedMealType === mealType;
          return (
            <button
              key={mealType}
              onClick={() => setSelectedMealType(mealType)}
              className={`${inter.className} font-bold text-xs md:text-sm px-6 py-2 rounded-full transition-all duration-200 ${
                isActive ? "bg-[#B52222] text-white shadow-inner" : "bg-transparent text-black"
              }`}
              style={{
                paddingTop: "1rem",
                paddingBottom: "1rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                ...(isActive ? { border: "1px solid #00000080" } : {}),
              }}
            >
              {mealType}
            </button>
          );
        })}
      </div>
    </div>
  </div>
</section>

{/* Menu Section */}
<section className="bg-white py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {foods[selectedMealType.toLowerCase() as keyof FoodGrouped].map((food, index) => (
        <div
          key={food.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <FoodCard {...food} onAddToCart={handleAddToCart} available />
        </div>
      ))}
    </div>
  </div>
</section>

    </div>
  );
}

