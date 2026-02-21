"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import CanteenCard from "../components/CanteenCard";

// Inter font definition (assuming it's used for styling components)
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


// --- INTERFACES ---
interface CanteenCardProps {
  id: string;
  name: string;
  location: string;
  rating: number | null; // Allow null/number from API data source
  isOpen?: boolean;
  image?: string;
  onViewClick?: (id: string) => void;
  className?: string;
  phone: string;
  description: string;
  seller_email: string;
  imageUrl?: string; // optional
}

export default function CanteensPage() {
  const router = useRouter();
  const [canteens, setCanteens] = useState<CanteenCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewCanteen = (id: string) => {
    router.push(`/canteen/${id}`);
  };

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

  // Navigation items
  const navItems: NavItem[] = [
  {
    label: "HOME",
    href: "/",
    isActive: true,
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    label: "CANTEENS",
    href: "/canteens",
    icon: (
      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "ORDERS",
    href: "/orders",
    icon: (
      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

  // Fetch canteens from API (using useCallback for better stability)
  const fetchCanteens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/canteens");
      if (!res.ok) throw new Error("Failed to fetch canteens");

      const data: CanteenCardProps[] = await res.json();
      setCanteens(data);
    } catch (err) {
      console.error("Error fetching canteens:", err);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    fetchCanteens();
  }, [fetchCanteens]);


  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      

      {/* Main Content */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          {/* Page Title */}
          <h1
            className={`text-3xl md:text-4xl font-bold text-black mb-8 ${inter.className}`}
            style={{ paddingBottom: "2rem" }}
          >
            All Canteens
          </h1>

          {loading ? (
            <p className="text-gray-600 text-lg">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {canteens.map((canteen, index) => (
                <div
                  key={canteen.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CanteenCard
                    {...canteen}
                    rating={canteen.rating || 0}
                    onViewClick={handleViewCanteen}
                    description={canteen.description || "No description available."}
                    phone={canteen.phone || "N/A"}
                    seller_email={canteen.seller_email || "N/A"}
                  />
                </div>
              ))}
              {canteens.length === 0 && !loading && (
                <p className="text-gray-500 text-lg col-span-full text-center">No canteens found at this time.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}