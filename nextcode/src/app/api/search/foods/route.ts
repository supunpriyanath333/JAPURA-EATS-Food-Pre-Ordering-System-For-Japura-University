// src/app/api/search/foods/route.ts

import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  id: string;
  name: string;
  canteen_id: string; 
  canteen_name: string; 
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.toLowerCase();

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] }, { status: 200 });
        }

        // --- 1. Query Database ---
        // Ensure 'canteens' is spelled correctly here.
        const { data, error } = await supabase
            .from("food_items")
            .select(`
                id, 
                name, 
                canteen_id,
                canteens(name) // <-- MUST be spelled correctly
            `)
            .ilike("name", `%${query}%`)
            .limit(8); 

        if (error) {
            console.error("Search API Database Error:", error);
            return NextResponse.json({ error: "Database search failed" }, { status: 500 });
        }

       

  

    } catch (e) {
        console.error("Server error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}