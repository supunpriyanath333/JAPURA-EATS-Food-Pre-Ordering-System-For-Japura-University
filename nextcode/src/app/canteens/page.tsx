"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import CanteenCard from "../components/CanteenCard";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface CanteenCardProps {
  id: string;
  name: string;
  location: string;
  rating: number | null;
  isOpen?: boolean;
  image?: string;
  onViewClick?: (id: string) => void;
  className?: string;
  phone: string;
  seller_email: string;
  imageUrl?: string;
}

export default function CanteensPage() {
  const router = useRouter();
  const [canteens, setCanteens] = useState<CanteenCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState<string[]>([]);

  const handleViewCanteen = (id: string) => {
    router.push(`/canteen/${id}`);
  };

  const toggleFavourite = (id: string) => {
    setFavIds((prev) => {
      const newFavs = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("japura_fav_canteens", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const fetchCanteens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/canteens");
      if (!res.ok) throw new Error("Failed to fetch canteens");

      const data = await res.json();
      if (Array.isArray(data)) {
        setCanteens(data);
      } else {
        console.error("Canteen data is not an array:", data);
        setCanteens([]);
      }
    } catch (err) {
      console.error("Error fetching canteens:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCanteens();
    // Load favourites from local storage
    const saved = localStorage.getItem("japura_fav_canteens");
    if (saved) {
      try {
        setFavIds(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing favs", e);
      }
    }
  }, [fetchCanteens]);

  const favouriteCanteens = canteens.filter((c) => favIds.includes(c.id));
  const otherCanteens = canteens.filter((c) => !favIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <main className="flex-1" style={{ paddingBottom: '40px' }}>
        {/* Main Content Area */}
        <section style={{ paddingTop: '40px', paddingBottom: '40px', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <div className="container mx-auto flex flex-col gap-y-16 max-w-7xl">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#B52222]"></div>
              </div>
            ) : canteens.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No canteens found at this time.</p>
              </div>
            ) : (
              <>
                {/* Your Favourites Section */}
                {favouriteCanteens.length > 0 && (
                  <div className="flex flex-col gap-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                      <span className="text-2xl">❤️</span>
                      <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${inter.className}`}>
                        Your Favourites
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {favouriteCanteens.map((canteen, index) => (
                        <div key={canteen.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <CanteenCard
                            {...canteen}
                            rating={canteen.rating || 0}
                            onViewClick={handleViewCanteen}
                            phone={canteen.phone || "N/A"}
                            seller_email={canteen.seller_email || "N/A"}
                            isFavourite={true}
                            onToggleFavourite={toggleFavourite}
                            className="h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All / Other Canteens */}
                <div className="flex flex-col gap-y-8">
                  <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${inter.className}`}>
                      {favouriteCanteens.length > 0 ? "Other Canteens" : "All Canteens"}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {otherCanteens.map((canteen, index) => (
                      <div key={canteen.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CanteenCard
                          {...canteen}
                          rating={canteen.rating || 0}
                          onViewClick={handleViewCanteen}
                          phone={canteen.phone || "N/A"}
                          seller_email={canteen.seller_email || "N/A"}
                          isFavourite={false}
                          onToggleFavourite={toggleFavourite}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}