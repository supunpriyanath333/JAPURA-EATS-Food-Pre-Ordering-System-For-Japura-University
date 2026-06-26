"use client";

import {
  HeroSection,
  FoodCard,
  PromoBanner,
  Footer,
  SectionHeader,
  CanteenCard,
} from "./components";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Sample data - In a real app, this would come from an API
// const featuredCanteens = [
//   {
//     id: "canteen-001",
//     name: "Canteen 0001",
//     location: "Faculty of Management",
//     rating: 4.7,
//     isOpen: true,
//     image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "canteen-002",
//     name: "Canteen 0001",
//     location: "Faculty of Management",
//     rating: 4.7,
//     isOpen: true,
//     image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "canteen-003",
//     name: "Canteen 0001",
//     location: "Faculty of Management",
//     rating: 4.7,
//     isOpen: true,
//     image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&auto=format&fit=crop&q=80",
//   },
// ];

// const popularFoodsCanteen1 = [
//   {
//     id: "food-001",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-002",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-003",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-004",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
// ];

// const popularFoodsCanteen2 = [
//   {
//     id: "food-005",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-006",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-007",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
//   {
//     id: "food-008",
//     name: "String Hoppers with Curry",
//     description: "Traditional string hoppers served with dhal curry and sumbol",
//     price: 150,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80",
//   },
// ];


interface CanteenCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  isOpen?: boolean;
  image?: string;
  onViewClick?: (id: string) => void;
  className?: string;
  phone: string;
  description: string;
  seller_email: string;
  imageUrl?: string; // optional
}
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

export default function Home() {
  const router = useRouter();
  const [featuredCanteens, setFeaturedCanteens] = useState<CanteenCardProps[]>([]);
  const [canteensWithFoods, setCanteensWithFoods] = useState<
  { canteen: CanteenCardProps; foods: FoodCardProps[] }[]
>([]);

  

 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const canteensRes = await fetch("/api/canteens");
        const canteensData = await canteensRes.json();
        
        let canteens: CanteenCardProps[] = Array.isArray(canteensData) ? canteensData : [];
        canteens = [...canteens].sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setFeaturedCanteens(canteens);

        const topCanteens = canteens.slice(0, 4);

        const results = await Promise.all(
          topCanteens.map(async (canteen) => {
            try {
              const foodsRes = await fetch(`/api/canteens/${canteen.id}/foods`);
              const foodsData = await foodsRes.json();

              if (!foodsData || foodsData.error) {
                return { canteen, foods: [] };
              }

              const flattenFoods = (grouped: Record<string, FoodCardProps[]>) =>
                Object.values(grouped || {}).flat();

              const flat = flattenFoods(foodsData);

              // 🔥 FIX: remove invalid items
              let cleanedFoods = flat.filter(
                (food) =>
                  food &&
                  typeof food.price === "number" &&
                  food.name &&
                  food.id
              );
              
              // Sort by rating descending and take top 3
              cleanedFoods = cleanedFoods.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

              return {
                canteen,
                foods: cleanedFoods,
              };
            } catch (err) {
              console.error(`Error fetching foods for canteen ${canteen.id}:`, err);
              return { canteen, foods: [] };
            }
          })
        );

        setCanteensWithFoods(results.filter(r => r.foods.length > 0));
      } catch (error) {
        console.error("Error fetching canteens & foods:", error);
      }
    };

    fetchAll();
  }, []);

  

  // Handlers
  const handleViewCanteen = (id: string) => {
    router.push(`/canteen/${id}`);
  };

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
    // Add item to cart
  };

  return (
<div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
  {/* Header + Hero Section (no gap) */}
  <HeroSection
    title="Welcome To JAPURA EATS"
    description="Pre-order your favorite meals from University Canteens and skip the queue. The Easier Way to Eat at Japura."
    primaryButtonText="Get Start"
    secondaryButtonText="About Us"
    searchPlaceholder="   Search Your Favourite Food Here"
    backgroundImage="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&auto=format&fit=crop&q=80"
  />

  {/* Main content with consistent spacing */}
  <div className="flex flex-col gap-y-16">
    {/* Featured Canteens Section */}
<section className="py-16">
  <div className="container mx-auto flex flex-col gap-y-6">
    <SectionHeader
      title="Featured Canteens"
      linkText="View All Canteens"
      linkHref="/canteens"
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {featuredCanteens.slice(0, 4).map((canteen, index) => (
        <div
          key={canteen.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CanteenCard {...canteen} onViewClick={handleViewCanteen} />
        </div>
      ))} 
    </div>
  </div>
</section>




    {/* Popular Food Section */}
    {/* <section className="py-10 px-4 bg-white">
      <div className="container mx-auto flex flex-col gap-y-6">
        <h2 className={`${inter.className} text-2xl md:text-3xl font-bold text-black`}>
          Popular Food
        </h2>

     
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`${inter.className} text-base font-bold text-black`}>
              From Canteen 0001
            </h3>
            <a
              href="/canteen/001"
              className={`${inter.className} text-sm text-gray-500 hover:text-gray-700 transition-colors`}
            >
              see more
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularFoodsCanteen1.map((food, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FoodCard {...food} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>

        
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`${inter.className} text-base font-bold text-black`}>
              From Canteen 0002
            </h3>
            <a
              href="/canteen/002"
              className={`${inter.className} text-sm text-gray-500 hover:text-gray-700 transition-colors`}
            >
              see more
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularFoodsCanteen2.map((food, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FoodCard {...food} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section> */}

<section className="py-16">
  <div className="container mx-auto flex flex-col gap-y-12">
    <SectionHeader
      title="Popular Food"
      linkText="View Full Menu"
      linkHref="/menu"
    />

    {canteensWithFoods.map(({ canteen, foods }, index) => (
      <div key={canteen.id} className="flex flex-col gap-y-8">
        
        {/* Canteen Title */}
        <div className="flex items-center gap-4 mb-2">
          <h3 className={`${inter.className} text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap`}>
            From <span className="text-[#B52222]">{canteen.name}</span>
          </h3>
          
          <div className="flex-1 h-[2px] bg-gray-200/80 rounded-full"></div>

          <a
            href={`/canteen/${canteen.id}`}
            className={`${inter.className} text-sm md:text-base font-bold text-gray-500 hover:text-[#B52222] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap`}
          >
            see more
            <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food, idx) => (
            <div
              key={idx}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <FoodCard {...food} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>

      </div>
    ))}
  </div>
</section>


    {/* Promotional Banner */}
    <PromoBanner
      title="Up to 10% off — Today Only"
      subtitle="Selected items. Prices drop automatically at checkout."
      description="Order above Rs.1000.00 From Canteen 002"
      buttonText="View Now"
      buttonHref="/offers"
      backgroundImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    />

    {/* Footer */}
    <Footer
      contactPhone="+94 77 123 4567"
      contactEmail="info@japuraeats.lk"
    />
  </div>
</div>


  );
}
