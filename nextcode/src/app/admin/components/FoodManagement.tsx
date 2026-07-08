import { useState, useCallback, useEffect } from "react";
import { MealType, FoodItem } from "../../../../global";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface FoodItemManagementProps {
    canteenId: string;
}

const MEAL_TABS: { key: MealType, label: string }[] = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' }
];

const FoodItemManagement: React.FC<FoodItemManagementProps> = ({ canteenId }) => {
    const [activeMeal, setActiveMeal] = useState<MealType>('lunch');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState<number | "">("");
    const [newItemDescription, setNewItemDescription] = useState("");
    const [newItemImage, setNewItemImage] = useState<File | null>(null);
    const [newItemImagePreview, setNewItemImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [foodItems, setFoodItems] = useState<{ [key in MealType]: FoodItem[] }>({
        breakfast: [],
        lunch: [],
        dinner: []
    });

    const fetchFoodItems = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("food_items")
                .select("*")
                .eq("canteen_id", canteenId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching food items:", error.message);
                return;
            }

            if (data) {
                const grouped = {
                    breakfast: data.filter((item: any) => item.meal_type === "breakfast"),
                    lunch: data.filter((item: any) => item.meal_type === "lunch"),
                    dinner: data.filter((item: any) => item.meal_type === "dinner"),
                };
                setFoodItems(grouped);
            }
        } catch (err) {
            console.error("Unexpected error fetching food items:", err);
        } finally {
            setLoading(false);
        }
    }, [canteenId]);

    useEffect(() => {
        if (canteenId) {
            fetchFoodItems();
        }
    }, [canteenId, fetchFoodItems]);

    const handleToggleAvailability = async (item: FoodItem) => {
        try {
            const { error } = await supabase
                .from("food_items")
                .update({ available: !item.available })
                .eq("id", item.id);

            if (error) {
                alert(`Error toggling availability: ${error.message}`);
                return;
            }
            fetchFoodItems();
        } catch (err) {
            console.error("Error toggling availability:", err);
            alert("An unexpected error occurred.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewItemImage(file);
            setNewItemImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadFoodImage = async (file: File, cId: string): Promise<string | null> => {
        if (!file) return null;
        const fileExt = file.name.split(".").pop();
        const fileName = `${cId}_${Date.now()}.${fileExt}`;
        const filePath = `newbucket/${fileName}`;
    
        const { error: uploadError } = await supabase.storage
            .from("newbucket")
            .upload(filePath, file, { cacheControl: "3600", upsert: true, contentType: file.type });
    
        if (uploadError) {
            console.error("Image upload error:", uploadError);
            return null;
        }
    
        const { data: publicData } = supabase.storage
            .from("newbucket")
            .getPublicUrl(filePath);
    
        return publicData.publicUrl;
    };

    const submitNewFoodItem = async () => {
        if (!newItemName || !newItemPrice || !newItemDescription) {
            alert("Please fill in all required fields (Name, Price, Description).");
            return;
        }
        setUploading(true);

        let imageUrl = "https://via.placeholder.com/150";
        if (newItemImage) {
            const uploadedUrl = await uploadFoodImage(newItemImage, canteenId);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                alert("Failed to upload image. Using placeholder.");
            }
        }

        try {
            const { error } = await supabase.from("food_items").insert([{
                canteen_id: canteenId,
                name: newItemName,
                price: Number(newItemPrice),
                description: newItemDescription,
                image_url: imageUrl,
                meal_type: activeMeal,
                available: true
            }]);

            if (error) {
                alert(`Failed to add food item: ${error.message}`);
                setUploading(false);
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
            alert("An unexpected error occurred.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const { error } = await supabase.from('food_items').delete().eq('id', id);
            if (error) {
                alert(`Failed to delete: ${error.message}`);
            } else {
                fetchFoodItems();
            }
        }
    };

    return (
        <div className="!max-w-7xl !mx-auto !flex !flex-col !gap-8 !pb-12">
            <div className="!text-center !mb-4">
                <h3 className="!text-3xl md:!text-4xl !font-extrabold !text-gray-900 !tracking-tight">Canteen Menu Management</h3>
                <p className="!text-gray-500 !font-medium !mt-2">Organize and update your daily food offerings</p>
            </div>
            
            {/* Meal Type Toggle (Modern Capsule Style) */}
            <div className="!flex !justify-center !bg-white/60 !backdrop-blur-md !p-1.5 !rounded-full !shadow-sm !border !border-white/60 !max-w-xl !mx-auto !w-full">
                {MEAL_TABS.map((meal) => (
                    <button key={meal.key}
                        onClick={() => setActiveMeal(meal.key)}
                        className={`!flex-1 !py-3 !px-6 !text-sm md:!text-base !font-bold !rounded-full !transition-all !duration-300 ${activeMeal === meal.key ? '!bg-[#B52222] !text-white !shadow-md !border !border-[#9a1b1b]' : '!text-gray-500 hover:!text-gray-800 hover:!bg-white/40'}`}>
                        {meal.label}
                    </button>
                ))}
            </div>

            {/* Food Item Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-6 !mt-4">
                {loading ? (
                    <div className="!col-span-full !py-20 !flex !flex-col !items-center !justify-center">
                        <div className="!w-12 !h-12 !border-4 !border-gray-200 !border-t-[#B52222] !rounded-full !animate-spin !mb-4"></div>
                        <p className="!text-gray-500 !font-semibold !animate-pulse">Loading menu...</p>
                    </div>
                ) : foodItems[activeMeal]?.length > 0 ? (
                    foodItems[activeMeal].map((item: FoodItem) => (
                        <div key={item.id} className="!bg-white/80 !backdrop-blur-xl !rounded-2xl !shadow-sm hover:!shadow-lg !border !border-white/60 !overflow-hidden !transition-all !duration-300 hover:!-translate-y-1 !flex !flex-col">
                            <div className="!h-48 !w-full !relative !bg-gray-100">
                                <Image src={item.image_url || "https://via.placeholder.com/150"} alt={item.name} layout="fill" objectFit="cover" className="!transition-transform !duration-500 hover:!scale-105" />
                                <div className="!absolute !top-3 !right-3">
                                    <button onClick={() => handleDelete(item.id)} className="!bg-white/90 !backdrop-blur-md !p-2 !rounded-full !text-red-500 hover:!bg-red-500 hover:!text-white !transition-colors !shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="!h-4 !w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="!p-5 !flex !flex-col !flex-grow">
                                <div className="!flex !justify-between !items-start !mb-2">
                                    <h4 className="!font-extrabold !text-lg !text-gray-900 !leading-tight">{item.name}</h4>
                                </div>
                                <p className="!text-sm !text-gray-500 !mb-4 !line-clamp-2 !flex-grow">{item.description}</p>
                                
                                <div className="!flex !justify-between !items-center !mt-auto !pt-4 !border-t !border-gray-100">
                                    <span className="!text-xl !font-black !text-[#B52222]">Rs. {item.price}.00</span>
                                    <button onClick={() => handleToggleAvailability(item)}
                                        className={`!px-3 !py-1.5 !text-xs !font-bold !rounded-full !transition-all !shadow-sm ${item.available ? '!bg-green-100 !text-green-700 hover:!bg-green-200' : '!bg-red-100 !text-red-700 hover:!bg-red-200'}`}>
                                        {item.available ? 'Available' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="!col-span-full !bg-white/60 !backdrop-blur-xl !p-12 !rounded-3xl !border !border-white/60 !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !text-center !flex !flex-col !items-center !justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="!h-16 !w-16 !text-gray-400 !mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="!text-gray-500 !text-lg !font-medium">No {activeMeal} items listed yet. Time to add some food!</p>
                    </div>
                )}
            </div>
            
            {/* Add New Item Button */}
            <div className="!text-center !mt-8">
                <button onClick={() => setShowAddForm(true)}
                    className="!inline-flex !items-center !justify-center !gap-2 !py-4 !px-8 !bg-gradient-to-r !from-[#B52222] !to-[#9a1b1b] !text-white !font-bold !rounded-xl !transition-all !duration-300 !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 hover:!-translate-y-1 active:!scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="!h-6 !w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add New Item to Menu</span>
                </button>
            </div>

            {/* Add Food Form Modal */}
            {showAddForm && (
                <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !p-4 !bg-black/50 !backdrop-blur-sm animate-fade-in-up">
                    <div className="!bg-white/95 !backdrop-blur-2xl !w-full !max-w-lg !rounded-3xl !shadow-2xl !border !border-white/50 !overflow-hidden !flex !flex-col !max-h-[90vh]">
                        <div className="!p-6 !border-b !border-gray-100 !flex !justify-between !items-center !bg-gray-50/50">
                            <h3 className="!text-2xl !font-extrabold !text-gray-900">Add New {activeMeal.charAt(0).toUpperCase() + activeMeal.slice(1)} Item</h3>
                            <button onClick={() => setShowAddForm(false)} className="!text-gray-400 hover:!text-red-500 !transition-colors !p-2 !rounded-full hover:!bg-red-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="!h-6 !w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="!p-6 !overflow-y-auto !flex-grow !flex !flex-col !gap-5">
                            <div>
                                <label className="!block !text-sm !font-bold !text-gray-700 !mb-1.5 !ml-1">Food Name <span className="!text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. Chicken Kottu" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} 
                                    className="!w-full !px-4 !py-3 !bg-gray-50 !border !border-gray-200 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white !transition-all !text-gray-800 !font-medium" />
                            </div>
                            
                            <div>
                                <label className="!block !text-sm !font-bold !text-gray-700 !mb-1.5 !ml-1">Price (Rs) <span className="!text-red-500">*</span></label>
                                <div className="!relative">
                                    <span className="!absolute !left-4 !top-[50%] !-translate-y-[50%] !text-gray-500 !font-bold">Rs.</span>
                                    <input type="number" placeholder="0.00" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value as any)} 
                                        className="!w-full !pl-12 !pr-4 !py-3 !bg-gray-50 !border !border-gray-200 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white !transition-all !text-gray-800 !font-medium" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="!block !text-sm !font-bold !text-gray-700 !mb-1.5 !ml-1">Description <span className="!text-red-500">*</span></label>
                                <textarea placeholder="Delicious and spicy chicken kottu..." value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} 
                                    className="!w-full !px-4 !py-3 !bg-gray-50 !border !border-gray-200 !rounded-xl focus:!outline-none focus:!ring-2 focus:!ring-[#B52222]/40 focus:!bg-white !transition-all !text-gray-800 !font-medium !h-24 !resize-none" />
                            </div>
                            
                            <div>
                                <label className="!block !text-sm !font-bold !text-gray-700 !mb-1.5 !ml-1">Food Image</label>
                                <div className="!relative !border-2 !border-dashed !border-gray-300 !rounded-xl !p-6 !text-center hover:!bg-gray-50 hover:!border-[#B52222]/50 !transition-all !cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="!absolute !inset-0 !w-full !h-full !opacity-0 !cursor-pointer !z-10" />
                                    {newItemImagePreview ? (
                                        <div className="!w-full !h-32 !relative !rounded-lg !overflow-hidden">
                                            <Image src={newItemImagePreview} alt="Preview" layout="fill" objectFit="cover" />
                                        </div>
                                    ) : (
                                        <div className="!flex !flex-col !items-center !text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="!h-10 !w-10 !mb-2 !text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="!font-semibold !text-sm">Click or drag image to upload</span>
                                            <span className="!text-xs !text-gray-400 !mt-1">PNG, JPG, JPEG</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="!p-6 !border-t !border-gray-100 !bg-gray-50 !flex !gap-4">
                            <button onClick={() => setShowAddForm(false)} disabled={uploading}
                                className="!flex-1 !py-3 !bg-white !text-gray-700 !font-bold !rounded-xl !border !border-gray-200 hover:!bg-gray-100 !transition-colors !shadow-sm">
                                Cancel
                            </button>
                            <button onClick={submitNewFoodItem} disabled={uploading}
                                className="!flex-1 !py-3 !bg-[#B52222] !text-white !font-bold !rounded-xl hover:!bg-[#9a1b1b] !transition-colors !shadow-md disabled:!opacity-70 !flex !justify-center !items-center !gap-2">
                                {uploading ? (
                                    <><div className="!w-4 !h-4 !border-2 !border-white !border-t-transparent !rounded-full !animate-spin"></div><span>Uploading...</span></>
                                ) : (
                                    <span>Add Item</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodItemManagement;