// app/admin/api/food_items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {

    const supabase = supabaseServer();
    const body = await req.json();
    const {
      canteen_id,
      meal_type,
      name,
      price,
      description,
      available,
      image_base64,
      image_name,
    } = body ?? {};

    if (!canteen_id || !meal_type || !name || !price) {
      return NextResponse.json(
        { error: "canteen_id, meal_type, name and price are required" },
        { status: 400 }
      );
    }

    
    let image_url: string | null = null;

    const mimeType = image_name.endsWith(".png")
  ? "image/png"
  : image_name.endsWith(".jpg") || image_name.endsWith(".jpeg")
  ? "image/jpeg"
  : "application/octet-stream";


    // If there's an image, upload it
    if (image_base64 && image_name) {
      // Convert base64 -> buffer
      const buffer = Buffer.from(image_base64, "base64");



      // Upload to bucket 'food-images' under folder [canteen_id]/[image_name]
      const uploadResult = await supabase.storage
        .from("food-images")
        .upload(`${canteen_id}/${image_name}`, buffer, {
          cacheControl: "3600",
          upsert: true,
          contentType: mimeType, // adjust if you can detect mime type
        });

      // uploadResult has shape { data: { path: string } | null, error: PostgrestError | null }
      if (uploadResult.error) {
        console.error("Image upload error:", uploadResult.error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      const uploadedPath = uploadResult.data?.path;
      if (!uploadedPath) {
        console.error("Upload succeeded but no path returned", uploadResult);
        // continue without image or return error depending on desired behavior
      } else {
        // getPublicUrl returns { data: { publicUrl: string } }
        const urlResult = supabase.storage
          .from("food-images")
          .getPublicUrl(uploadedPath);

        // In many supabase client versions getPublicUrl is synchronous (returns data object),
        // but some typings differ; handle both ways:
        // urlResult may be { data: { publicUrl } } or a Promise; below handles both.
        const urlData = "then" in (urlResult as any)
          ? await (urlResult as any)
          : urlResult;

        const publicUrl = urlData?.data?.publicUrl;
        if (!publicUrl) {
          console.warn("Could not obtain public URL for uploaded image", urlData);
        } else {
          image_url = publicUrl;
        }
      }
    }

    // Insert food item row
    const insertResult = await supabase.from("food_items").insert({
      canteen_id,
      meal_type,
      name,
      price,
      description,
      available: available ?? true,
      image_url,
    });

    if (insertResult.error) {
      console.error("Insert food_item error:", insertResult.error);
      return NextResponse.json(
        { error: insertResult.error.message || "Failed to insert food item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: insertResult.data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in API:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
