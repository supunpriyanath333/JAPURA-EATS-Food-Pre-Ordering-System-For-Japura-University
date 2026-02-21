
import { useState, useCallback, useEffect } from "react";
import { MealType, FoodItem } from "../../../../global";
import { PRIMARY_TEXT, CARD_BG, SECONDARY_TEXT, GRAY_BORDER, SUCCESS_COLOR, ERROR_COLOR, JAPURA_EATS_COLOR } from "../constants/colors";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";



interface FoodItemManagementProps {
    canteenId: string;
}

const FoodItemManagement: React.FC<FoodItemManagementProps> = ({ canteenId }) => {
    const [activeMeal, setActiveMeal] = useState<MealType>('lunch'); // Default to Lunch
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState<number | "">("");
    const [newItemDescription, setNewItemDescription] = useState("");
    const [newItemImage, setNewItemImage] = useState<File | null>(null);
    const [newItemImagePreview, setNewItemImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

 

    const s3 = new S3Client({
    region: "us-east-1", // can be anything for Supabase S3
    credentials: {
        accessKeyId: process.env.S3_KEY!,
        secretAccessKey: process.env.S3_SECRET!,
    },
    endpoint: "https://osxtgxoimjitojyrwgso.storage.supabase.co",
    forcePathStyle: true,
    });

    async function uploadFoodImageS3(file: File, canteenId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${canteenId}_${Date.now()}.${fileExt}`;
    const filePath = `food-images/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: "food-images",
        Key: filePath,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // make it accessible
    });

    await s3.send(command);

    // Construct public URL manually
    return `https://osxtgxoimjitojyrwgso.storage.supabase.co/food-images/${fileName}`;
    }



    const [foodItems, setFoodItems] = useState<{ [key in MealType]: FoodItem[] }>({
        breakfast: [
            { id: 'f1', name: 'Milk Rice', price: 150, available: true },
            { id: 'f2', name: 'String Hoppers', price: 120, available: false }
        ], 
        lunch: [
            { id: 'f3', name: 'Chicken Kottu', price: 450, available: true },
            { id: 'f4', name: 'Veg Fried Rice', price: 350, available: true },
        ], 
        dinner: []
    });
    const [loading, setLoading] = useState<boolean>(false); // Mock loading state

    const fetchFoodItems = useCallback(async () => {
        setLoading(true);
    
        const { data, error } = await supabase
            .from("food_items")
            .select("*")
            .eq("canteen_id", canteenId);
    
        if (error) {
            console.error("Fetch error:", error);
            setLoading(false);
            return;
        }
    
        // Convert DB rows into structure grouped by meal type
        const grouped = {
            breakfast: data.filter((item: any) => item.meal_type === "breakfast"),
            lunch: data.filter((item: any) => item.meal_type === "lunch"),
            dinner: data.filter((item: any) => item.meal_type === "dinner"),
        };
    
        setFoodItems(grouped);
        setLoading(false);
    }, [canteenId]);
    

    useEffect(() => {
        // Mock fetch on mount
        fetchFoodItems(); 
    }, [fetchFoodItems]);

    const handleToggleAvailability = (item: FoodItem) => {
        // Mocking state update for the UI:
        setFoodItems(prev => ({
            ...prev,
            [activeMeal]: prev[activeMeal].map(i => i.id === item.id ? { ...i, available: !i.available } : i)
        }));
        // Mock supabase update call
        console.log(`Toggling availability for ${item.name}`);
        supabase.from('food_items').update({ available: !item.available });
    };

    const MEAL_TABS = [
        { key: 'breakfast', label: 'BREAKFAST', color: '#B52222' },
        { key: 'lunch', label: 'LUNCH', color: '#FAB301' }, // Orange/Yellow
        { key: 'dinner', label: 'DINNER', color: '#AA2B2B' },
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewItemImage(file);
            setNewItemImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadFoodImage = async (file: File, canteenId: string): Promise<string | null> => {
        if (!file) return null;
    
        const fileExt = file.name.split(".").pop();
        const fileName = `${canteenId}_${Date.now()}.${fileExt}`;
        const filePath = `newbucket/${fileName}`;
    
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("newbucket")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: true,
                contentType: file.type,
            });
    
        if (uploadError) {
            console.error("Image upload error:", uploadError);
            return null;
        }
    
        const { data: publicData } = supabase.storage
            .from("newbucket")
            .getPublicUrl(filePath);
    
        if (!publicData?.publicUrl) {
            console.error("Failed to get public URL for image");
            return null;
        }
    
        return publicData.publicUrl;
    };

    const insertFoodItem = async (foodItem: {
        canteen_id: string;
        meal_type: string;
        name: string;
        price: number;
        description?: string;
        image_url?: string | null;
    }) => {
        const { error } = await supabase
            .from("food_items")
            .insert(foodItem);
    
        if (error) {
            console.error("DB insert error:", error);
            return false;
        }
    
        return true;
    };
    
    
    
        
    const submitNewFoodItem = async () => {
        if (!newItemName || !newItemPrice) {
            alert("Name & Price are required");
            return;
        }
    
        setUploading(true);
    
        try {
            const image_url = newItemImage
                ? await uploadFoodImage(newItemImage, canteenId)
                : null;
    
            const success = await insertFoodItem({
                canteen_id: canteenId,
                meal_type: activeMeal,
                name: newItemName,
                price: Number(newItemPrice),
                description: newItemDescription,
                image_url,
            });
    
            if (!success) {
                alert("Failed to add food item");
                return;
            }
    
            setNewItemName("");
            setNewItemPrice("");
            setNewItemDescription("");
            setNewItemImage(null);
            setNewItemImagePreview(null);
            setShowAddForm(false);
    
            fetchFoodItems();
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred");
        } finally {
            setUploading(false);
        }
    };
    
    
    
    
    
    

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.75rem",
        marginTop: "1rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
        fontSize: "0.9rem"
    };
    
    const submitButtonStyle: React.CSSProperties = {
        width: "100%",
        marginTop: "1.5rem",
        padding: "0.75rem",
        background: JAPURA_EATS_COLOR,
        color: "white",
        fontWeight: "700",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer"
    };
    
    const cancelButtonStyle: React.CSSProperties = {
        width: "100%",
        marginTop: "1rem",
        padding: "0.75rem",
        background: "#ccc",
        color: "#000",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer"
    };
    
    

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.875rem', fontWeight: '800', color: PRIMARY_TEXT, textAlign: 'center', marginBottom: '1.5rem' }}>Canteen Menu Management</h3>
            
            {/* Meal Type Toggle (Modern Capsule Style) */}
            <div 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    borderRadius: '9999px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                    overflow: 'hidden', 
                    maxWidth: '36rem', 
                    margin: '0 auto', 
                    padding: '0.25rem',
                    backgroundColor: CARD_BG 
                }}
            >
                {MEAL_TABS.map((meal) => (
                    <button
                        key={meal.key}
                        onClick={() => setActiveMeal(meal.key as MealType)}
                        style={{
                            flex: 1,
                            paddingTop: '0.75rem', 
                            paddingBottom: '0.75rem', 
                            fontSize: '0.875rem', 
                            fontWeight: '800', 
                            transition: 'all 0.3s', 
                            letterSpacing: '0.05em',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeMeal === meal.key ? meal.color : 'transparent',
                            color: activeMeal === meal.key 
                                ? (meal.key === 'lunch' ? PRIMARY_TEXT : '#FFFFFF') // Black text for bright lunch color
                                : SECONDARY_TEXT,
                            borderRadius: '9999px', 
                            margin: '0 4px',
                            boxShadow: activeMeal === meal.key ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                        }}
                    >
                        {meal.label}
                    </button>
                ))}
            </div>

            {/* Food Item List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', paddingTop: '1rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: 'span 2', fontSize: '1.125rem', color: SECONDARY_TEXT }}>Loading menu...</p>
                ) : foodItems[activeMeal]?.length > 0 ? (
                    foodItems[activeMeal].map((item: FoodItem) => (
                        <div 
                            key={item.id} 
                            style={{ 
                                backgroundColor: CARD_BG, 
                                padding: '1.25rem', 
                                borderRadius: '0.75rem', 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                transition: 'transform 0.3s', 
                                border: `1px solid ${GRAY_BORDER}` 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div>
                                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: PRIMARY_TEXT }}>{item.name}</h4>
                                <p style={{ fontSize: '0.875rem', color: SECONDARY_TEXT }}>Rs. {item.price}.00</p>
                            </div>
                            <button
                                onClick={() => handleToggleAvailability(item)}
                                style={{
                                    paddingLeft: '1rem', 
                                    paddingRight: '1rem', 
                                    paddingTop: '0.5rem', 
                                    paddingBottom: '0.5rem', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 'bold', 
                                    borderRadius: '9999px', 
                                    transition: 'background-color 0.3s', 
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: item.available ? SUCCESS_COLOR : ERROR_COLOR,
                                    color: CARD_BG,
                                }}
                            >
                                {item.available ? 'Available' : 'Out of Stock'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', backgroundColor: CARD_BG, padding: '2.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                           <p style={{ color: SECONDARY_TEXT, fontSize: '1.125rem' }}>No {activeMeal} items listed yet. Time to add some food!</p>
                    </div>
                )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
                onClick={() => setShowAddForm(true)}
                style={{
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    borderRadius: '0.75rem',
                    color: CARD_BG,
                    fontWeight: '500',
                    fontSize: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s',
                    backgroundColor: JAPURA_EATS_COLOR,
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                + Add New Item to Menu
            </button>

            </div>
            {showAddForm && (
    <div 
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}
    >
        <div 
            style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "1rem",
                width: "90%",
                maxWidth: "450px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}
        >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                Add New {activeMeal} Item
            </h3>

            {/* Name */}
            <input
                type="text"
                placeholder="Food name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={inputStyle}
            />

            {/* Price */}
            <input
                type="number"
                placeholder="Price (Rs)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value as any)}
                style={inputStyle}
            />

            {/* Description */}
            <textarea
                placeholder="Description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                style={{
                    ...inputStyle,
                    height: "80px",
                    resize: "none"
                }}
            />

            {/* Image upload */}
            <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "1rem" }}
            />

            {/* Image Preview */}
            {newItemImagePreview && (
                <img 
                    src={newItemImagePreview} 
                    alt="Preview" 
                    style={{
                        width: "100%",
                        marginTop: "1rem",
                        borderRadius: "0.5rem"
                    }}
                />
            )}

            

            {/* Submit */}
            <button 
                onClick={submitNewFoodItem}
                disabled={uploading}
                style={submitButtonStyle}
            >
                {uploading ? "Uploading..." : "Add Item"}
            </button>

            {/* Cancel */}
            <button
                onClick={() => setShowAddForm(false)}
                style={cancelButtonStyle}
            >
                Cancel
            </button>
        </div>
    </div>
)}


        </div>
    );
};

export default FoodItemManagement;