import React, { useState } from 'react';
import { MealType } from '../../../../global';

interface AddFoodItemProps {
    canteenId: string;
    onItemAdded: () => void;
}

const AddFoodItem: React.FC<AddFoodItemProps> = ({ canteenId, onItemAdded }) => {
    const [mealType, setMealType] = useState<MealType>('lunch');
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [available, setAvailable] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let imageBase64: string | null = null;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            await new Promise<void>((resolve, reject) => {
                reader.onload = () => {
                    imageBase64 = (reader.result as string).split(',')[1];
                    resolve();
                };
                reader.onerror = reject;
            });
        }

        const res = await fetch('/admin/api/food_items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                canteen_id: canteenId,
                meal_type: mealType,
                name,
                price,
                description,
                available,
                image_base64: imageBase64,
                image_name: imageFile?.name,
            }),
        });

        const result = await res.json();
        if (!res.ok) {
            console.error(result.error);
            alert(result.error || 'Failed to add food item');
        } else {
            setName('');
            setPrice(0);
            setDescription('');
            setImageFile(null);
            setMealType('lunch');
            onItemAdded();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <select value={mealType} onChange={e => setMealType(e.target.value as MealType)}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
            </select>
            <input type="text" placeholder="Food Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <label>
                Available:
                <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
            </label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
            <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Food Item'}</button>
        </form>
    );
};

export default AddFoodItem;
