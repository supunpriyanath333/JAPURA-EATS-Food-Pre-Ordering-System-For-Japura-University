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
        const canteens: CanteenCardProps[] = await canteensRes.json();

        setFeaturedCanteens(canteens);

        const results = await Promise.all(
          canteens.map(async (canteen) => {
            const foodsRes = await fetch(`/api/canteens/${canteen.id}/foods`);
            const foodsData = await foodsRes.json();

            const flattenFoods = (grouped: Record<string, FoodCardProps[]>) =>
              Object.values(grouped || {}).flat();

            const flat = flattenFoods(foodsData);

            // 🔥 FIX: remove invalid items
            const cleanedFoods = flat.filter(
              (food) =>
                food &&
                typeof food.price === "number" &&
                food.name &&
                food.id
            );

            return {
              canteen,
              foods: cleanedFoods,
            };
          })
        );

        setCanteensWithFoods(results);
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
{/* Featured Canteens Section */}
<section className="pt-16 py-10 w-full mt-5">
  <div className="container mx-auto flex flex-col gap-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-full mt-8" style={{ paddingTop: "2rem"}}>
        <SectionHeader
          title="Featured Canteens"
          linkText="View All Canteens"
          linkHref="/canteens"
        />
      </div>

      {featuredCanteens.map((canteen, index) => (
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

<section className="py-10 px-4 bg-white">
  <div className="container mx-auto flex flex-col gap-y-10">
    <h2 className={`${inter.className} text-2xl md:text-3xl font-bold text-black`}>
      Popular Food
    </h2>

    {canteensWithFoods.map(({ canteen, foods }, index) => (
      <div key={canteen.id} className="flex flex-col gap-y-6">
        
        {/* Canteen Title */}
        <div className="flex items-center justify-between">
          <h3 className={`${inter.className} text-base font-bold text-black`}>
            From {canteen.name}
          </h3>

          <a
            href={`/canteen/${canteen.id}`}
            className={`${inter.className} text-sm text-gray-500 hover:text-gray-700 transition-colors`}
          >
            see more
          </a>
        </div>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
