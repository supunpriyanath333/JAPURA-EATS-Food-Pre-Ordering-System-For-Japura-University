
import { useState } from "react";
import { Canteen } from "../../../../global";
import { PRIMARY_TEXT, CARD_BG, GRAY_BORDER, MAIN_BG, JAPURA_EATS_COLOR, SECONDARY_TEXT, SUCCESS_COLOR, ERROR_COLOR, RED_COLOR } from "../constants/colors";
import AdminInput from "./AdminInput";
import { supabase } from "@/lib/supabaseClient";

interface CanteenManagementProps {
    canteens: Canteen[];
    fetchCanteens: () => void;
}

const CanteenManagement: React.FC<CanteenManagementProps> = ({ canteens, fetchCanteens }) => {
    const [name, setName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [sellerEmail, setSellerEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    // -------------------- Image Upload Helper --------------------
const uploadCanteenImage = async (
    file: File,
    canteenId: string
): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${canteenId}_${Date.now()}.${fileExt}`;
    const filePath = `newbucket/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("newbucket")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
        });

    if (uploadError) {
        console.error("Canteen image upload error:", uploadError);
        return null;
    }

    const { data: publicData } = supabase.storage
        .from("newbucket")
        .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
        console.error("Failed to get public URL for canteen image");
        return null;
    }

    return publicData.publicUrl;
};

// -------------------- Handle Add Canteen --------------------
const handleAddCanteen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!name || !location || !sellerEmail || !imageFile) {
        setError("Name, location, image file, and seller email are required!");
        setLoading(false);
        return;
    }

    try {
        // ✅ Upload image first (same as food flow)
        const imageUrl = await uploadCanteenImage(
            imageFile,
            sellerEmail // or a generated temp ID
        );

        if (!imageUrl) {
            setError("Canteen image upload failed");
            setLoading(false);
            return;
        }

        // ✅ Create canteen payload
        const newCanteen: Omit<Canteen, 'id'> = {
            name,
            location,
            phone,
            description,
            seller_email: sellerEmail,
            imageUrl,
            rating:4.5
        };

        // ✅ Insert canteen
        const response = await fetch('/admin/api/canteens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCanteen),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("API error:", result.error);
            setError(result.error || 'Failed to add canteen.');
            return;
        }

        // ✅ Success cleanup
        setSuccess(`Canteen "${name}" added successfully!`);
        setName('');
        setLocation('');
        setPhone('');
        setDescription('');
        setSellerEmail('');
        setImageFile(null);

        fetchCanteens();
    } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong!");
    } finally {
        setLoading(false);
    }
};

    

    // Use flexbox simulation for grid, targeting a 2:1 column ratio on desktop
    const gridStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    };
    // On larger screens (emulation), side-by-side
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        gridStyle.flexDirection = 'row';
    }

    return (
        <div style={gridStyle}>
            {/* Canteen List (takes 2/3 space on large screens) */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: PRIMARY_TEXT, borderBottom: '1px solid #D1D5DB', paddingBottom: '0.5rem' }}>
                    Existing Canteens ({canteens.length})
                </h3>
                <div 
                    style={{ 
                        backgroundColor: CARD_BG, 
                        padding: '1.5rem', 
                        borderRadius: '0.75rem', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', 
                        height: '65vh', 
                        overflowY: 'auto',
                        border: `1px solid ${GRAY_BORDER}` 
                    }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {canteens.map((canteen) => (
                            <div 
                                key={canteen.id} 
                                style={{ 
                                    backgroundColor: '#F9FAFB', 
                                    padding: '1rem', 
                                    borderRadius: '0.75rem', 
                                    transition: 'box-shadow 0.3s', 
                                    border: `1px solid ${MAIN_BG}`,
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}
                            >
                                <h4 style={{ fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem', color: JAPURA_EATS_COLOR }}>{canteen.name}</h4>
                                <p style={{ fontSize: '0.875rem', color: SECONDARY_TEXT, marginBottom: '0.5rem' }}>{canteen.description}</p>
                                <div style={{ fontSize: '0.75rem', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                    <p style={{ color: SECONDARY_TEXT }}>📍 {canteen.location}</p>
                                    <p style={{ color: SECONDARY_TEXT }}>📞 {canteen.phone}</p>
                                    <p style={{ color: PRIMARY_TEXT, fontWeight: '500' }}>✉️ {canteen.seller_email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add New Canteen Form (takes 1/3 space on large screens) */}
            <div style={{ 
                flex: 1, 
                backgroundColor: CARD_BG, 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                display: 'flex', 
                flexDirection: 'column',
                borderTop: `4px solid ${JAPURA_EATS_COLOR}`
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: PRIMARY_TEXT, marginBottom: '1.5rem' }}>Create New Canteen</h3>
                <form onSubmit={handleAddCanteen} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AdminInput label="Canteen Name" placeholder="Central Mess Hall" value={name} onChange={(e) => setName(e.target.value)} required />
                        <AdminInput label="Location" placeholder="Faculty of Management" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        <AdminInput label="Phone" placeholder="+94 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        <AdminInput label="Description" placeholder="Authentic Sri Lankan Cuisine." value={description} onChange={(e) => setDescription(e.target.value)} required />
                        <AdminInput label="Seller Email (Assign)" type="email" placeholder="seller@japura.edu" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} required />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: PRIMARY_TEXT }}>
                                Canteen Image
                            </label>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            style={{
                                padding: '0.5rem 0',
                                fontSize: '0.875rem',
                                color: PRIMARY_TEXT
                            }}
                            className="canteen-file-input"
                        />

                        </div>


                        
                        {success && <p style={{ color: SUCCESS_COLOR, fontSize: '0.875rem', fontWeight: '600', paddingTop: '0.5rem' }}>{success}</p>}
                        {error && <p style={{ color: ERROR_COLOR, fontSize: '0.875rem', fontWeight: '600', paddingTop: '0.5rem' }}>{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            color: CARD_BG, 
                            fontWeight: 'bold', 
                            borderRadius: '0.5rem', 
                            padding: '0.75rem', 
                            transition: 'all 0.3s', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: RED_COLOR, 
                            marginTop: '1.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                    >
                        {loading ? 'CREATING...' : 'ADD NEW CANTEEN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CanteenManagement;