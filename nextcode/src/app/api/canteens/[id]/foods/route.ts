import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("canteen_id", id)
    .order("meal_type");

  if (error) return NextResponse.json({ error }, { status: 500 });

  const grouped: FoodGrouped = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  data?.forEach((item) => {
    const type = item.meal_type?.toLowerCase();

    const formatted: FoodCardProps = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price ?? 0,
      rating: item.rating ?? 0,
      image: item.image_url || "",
      available: item.available ?? true,
      currency: "LKR",
      image_url: item.image_url || "",
    };

    // 🔹 Type guard to narrow string to keys of grouped
    if (type === "breakfast" || type === "lunch" || type === "dinner") {
      const key = type as keyof FoodGrouped; // now TS knows it's valid
      grouped[key].push(formatted);
    }
  });

  return NextResponse.json(grouped);
}
