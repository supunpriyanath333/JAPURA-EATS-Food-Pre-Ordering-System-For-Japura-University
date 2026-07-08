// src/app/admin/components/CanteenManagement.tsx
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
    // Add Canteen States
    const [name, setName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [sellerEmail, setSellerEmail] = useState<string>('');
    const [sellerPassword, setSellerPassword] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // Status States
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Edit Modal States
    const [editingCanteen, setEditingCanteen] = useState<Canteen | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editLocation, setEditLocation] = useState<string>('');
    const [editPhone, setEditPhone] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editSellerEmail, setEditSellerEmail] = useState<string>('');
    const [editSellerPassword, setEditSellerPassword] = useState<string>(''); // Optional update
    const [editLoading, setEditLoading] = useState<boolean>(false);

    // Track simulated disabled canteens (temporary UI state)
    const [disabledCanteens, setDisabledCanteens] = useState<Record<string, boolean>>({});

    const toggleCanteenStatus = (id: string) => {
        setDisabledCanteens(prev => ({ ...prev, [id]: !prev[id] }));
    };

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
        if (!name || !location || !sellerEmail || !sellerPassword || !imageFile) {
            setError("All fields including password and image are required!");
            setLoading(false);
            return;
        }
        try {
            const imageUrl = await uploadCanteenImage(imageFile, sellerEmail);
            if (!imageUrl) {
                setError("Canteen image upload failed");
                setLoading(false);
                return;
            }
            const newCanteen = {
                name, location, phone, description, seller_email: sellerEmail, seller_password: sellerPassword, imageUrl, rating: 4.5
            };
            const response = await fetch('/admin/api/canteens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCanteen),
            });
            const result = await response.json();
            if (!response.ok) {
                setError(result.error || 'Failed to add canteen.');
                return;
            }
            setSuccess(`Canteen "${name}" added successfully!`);
            setName(''); setLocation(''); setPhone(''); setDescription(''); setSellerEmail(''); setSellerPassword(''); setImageFile(null);
            fetchCanteens();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("Something went wrong!");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    // -------------------- Handle Edit Canteen --------------------
    const openEditModal = (canteen: Canteen) => {
        setEditingCanteen(canteen);
        setEditName(canteen.name);
        setEditLocation(canteen.location);
        setEditPhone(canteen.phone);
        setEditDescription(canteen.description);
        setEditSellerEmail(canteen.seller_email);
        setEditSellerPassword(''); // Leave empty to not change
    };

    const handleSaveEdit = async () => {
        if (!editingCanteen) return;
        setEditLoading(true);
        try {
            const updatePayload = {
                id: editingCanteen.id,
                name: editName,
                location: editLocation,
                phone: editPhone,
                description: editDescription,
                seller_email: editSellerEmail,
                seller_password: editSellerPassword || undefined // Only send if changed
            };

            const res = await fetch('/admin/api/canteens', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (res.ok) {
                setEditingCanteen(null);
                fetchCanteens();
            } else {
                const errData = await res.json();
                alert("Failed to update canteen: " + (errData.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert("Error updating canteen");
        } finally {
            setEditLoading(false);
        }
    };

    // -------------------- Handle Delete Canteen --------------------
    const handleDeleteCanteen = async (id: string, canteenName: string) => {
        if (confirm(`Are you absolutely sure you want to delete ${canteenName}? This action cannot be undone.`)) {
            try {
                const res = await fetch('/admin/api/canteens', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });

                if (res.ok) {
                    fetchCanteens();
                } else {
                    alert("Failed to delete canteen");
                }
            } catch (err) {
                console.error(err);
                alert("Error deleting canteen");
            }
        }
    };

    // Add Canteen Modal State
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="!animate-fade-in-up !relative">
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-8 !gap-4">
                <div>
                    <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight">Canteen Management</h2>
                    <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Manage university canteens and their seller accounts.</p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                    className="!cursor-pointer !bg-gradient-to-r !from-[#B52222] !to-[#8a1919] !text-white !px-6 !py-3 !rounded-xl !font-bold !shadow-lg !shadow-red-900/20 hover:!shadow-xl hover:!shadow-red-900/30 hover:!-translate-y-0.5 !transition-all !flex !items-center !gap-2"
                >
                    <svg className="!w-5 !h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add New Canteen
                </button>
            </div>
            
            {/* Full Width Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-6">
                {canteens.map((canteen) => (
                    <div key={canteen.id} className={`!bg-white/60 !backdrop-blur-xl !border ${disabledCanteens[canteen.id] ? '!border-red-200/80 !opacity-75' : '!border-white/60'} !rounded-2xl !p-6 !transition-all hover:!shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:!-translate-y-1 !relative !group !overflow-hidden !flex !flex-col !shadow-[0_4px_20px_rgb(0,0,0,0.03)]`}>
                        
                        {disabledCanteens[canteen.id] && (
                            <div className="!absolute !top-0 !left-0 !bg-red-100 !text-red-800 !text-[10px] !font-bold !px-3 !py-1 !rounded-br-xl !uppercase tracking-wider !z-10">
                                Disabled
                            </div>
                        )}

                        {/* Canteen Image */}
                        <div className="!w-full !h-40 !rounded-xl !bg-gray-100 !overflow-hidden !mb-5 !relative !group/img">
                            {canteen.imageUrl ? (
                                <img src={canteen.imageUrl} alt={canteen.name} className="!w-full !h-full !object-cover !transition-transform group-hover/img:!scale-105" />
                            ) : (
                                <div className="!w-full !h-full !flex !items-center !justify-center !text-gray-300">
                                    <svg className="!w-12 !h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </div>
                            )}
                            <div className="!absolute !inset-0 !bg-gradient-to-t !from-black/40 !to-transparent !opacity-0 group-hover/img:!opacity-100 !transition-opacity"></div>
                            
                            {/* Action Buttons */}
                            <div className="!absolute !top-2 !right-2 !flex !gap-1.5 !z-10">
                                <button onClick={() => openEditModal(canteen)}
                                    className="!cursor-pointer !p-2 !bg-white/90 !backdrop-blur-sm !text-blue-600 hover:!bg-blue-50 !rounded-xl !shadow-sm !border !border-gray-200/50 !transition-colors"
                                    title="Edit Canteen"
                                >
                                    <svg className="!w-4 !h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => handleDeleteCanteen(canteen.id, canteen.name)}
                                    className="!cursor-pointer !p-2 !bg-white/90 !backdrop-blur-sm !text-red-600 hover:!bg-red-50 !rounded-xl !shadow-sm !border !border-gray-200/50 !transition-colors"
                                    title="Delete Canteen"
                                >
                                    <svg className="!w-4 !h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="!flex-1">
                            <h4 className="!font-black !text-gray-900 !text-xl !truncate !mb-1" title={canteen.name}>{canteen.name}</h4>
                            <p className="!text-sm !font-bold !text-[#B52222] !truncate !mb-4">{canteen.seller_email}</p>
                            
                            <div className="!space-y-2 !mb-6">
                                <div className="!flex !items-center !gap-2 !text-sm !text-gray-600 !font-semibold">
                                    <svg className="!w-4 !h-4 !text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <span className="!truncate">{canteen.location}</span>
                                </div>
                                <div className="!flex !items-center !gap-2 !text-sm !text-gray-600 !font-semibold">
                                    <svg className="!w-4 !h-4 !text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    <span className="!truncate">{canteen.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="!flex !items-center !justify-between !border-t !border-gray-100 !pt-4 !mt-auto">
                            <span className="!text-xs !font-black !text-gray-400 !uppercase !tracking-wider">Status</span>
                            <button onClick={() => toggleCanteenStatus(canteen.id)}
                                className={`!cursor-pointer !relative !inline-flex !h-7 !w-12 !items-center !rounded-full !transition-colors focus:!outline-none ${
                                    !disabledCanteens[canteen.id] ? '!bg-green-500' : '!bg-gray-300'
                                }`}
                            >
                                <span 
                                    className={`!inline-block !h-5 !w-5 !transform !rounded-full !bg-white !transition-transform !shadow-sm ${
                                        !disabledCanteens[canteen.id] ? '!translate-x-6' : '!translate-x-1'
                                    }`} 
                                />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Empty State / Add CTA Card */}
                <div 
                    onClick={() => setShowAddModal(true)}
                    className="!cursor-pointer !bg-white/40 !backdrop-blur-xl !border-2 !border-dashed !border-white/60 !rounded-2xl !p-6 !min-h-[300px] !flex !flex-col !items-center !justify-center !text-center hover:!border-[#B52222]/40 hover:!bg-red-50/40 !transition-all !group !shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
                >
                    <div className="!w-16 !h-16 !rounded-full !bg-white !shadow-sm !flex !items-center !justify-center !mb-4 group-hover:!scale-110 !transition-transform">
                        <svg className="!w-8 !h-8 !text-gray-400 group-hover:!text-[#B52222] !transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <h3 className="!text-lg !font-bold !text-gray-900 group-hover:!text-[#B52222] !transition-colors">Add New Canteen</h3>
                    <p className="!text-sm !text-gray-500 !mt-1">Click here to register a new canteen into the system.</p>
                </div>
            </div>

            {/* Add New Canteen Modal */}
            {showAddModal && (
                <div className="!fixed !inset-0 !z-[60] !flex !items-center !justify-center !p-4 !bg-black/40 !backdrop-blur-md !animate-fade-in-up">
                    <div className="!bg-white/80 !backdrop-blur-2xl !border !border-white/60 !rounded-[2rem] !shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] !w-full !max-w-2xl !max-h-[90vh] !overflow-hidden !flex !flex-col !relative">
                        <div className="!absolute !top-0 !left-0 !w-full !h-32 !bg-gradient-to-br !from-red-50 !to-white !-z-10"></div>
                        
                        <div className="!p-8 !border-b !border-gray-100 !flex !justify-between !items-center !bg-white/80 !backdrop-blur-md !sticky !top-0 !z-10">
                            <div>
                                <h3 className="!text-2xl !font-black !text-gray-900">Create New Canteen</h3>
                                <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Fill in the details to register a new vendor.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)}
                                className="!cursor-pointer !p-2 !bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-gray-900 !rounded-full !transition-colors"
                            >
                                <svg className="!w-6 !h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="!p-8 !overflow-y-auto custom-scrollbar">
                            <form id="addCanteenForm" onSubmit={(e) => {
                                handleAddCanteen(e).then(() => {
                                    if(success) setShowAddModal(false);
                                });
                            }} className="!grid !grid-cols-1 md:!grid-cols-2 !gap-x-6 !gap-y-5">
                                
                                <div className="md:!col-span-2">
                                    <AdminInput label="Canteen Name" placeholder="e.g. Central Mess Hall" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <AdminInput label="Location" placeholder="e.g. Science Faculty" value={location} onChange={(e) => setLocation(e.target.value)} required />
                                <AdminInput label="Phone Number" placeholder="+94 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                
                                <div className="md:!col-span-2">
                                    <AdminInput label="Description" placeholder="Short description about the food offered..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </div>

                                <div className="!mt-4 md:!col-span-2 !pt-4 !border-t !border-gray-100">
                                    <h4 className="!text-sm !font-black !text-gray-900 !uppercase !tracking-wider !mb-4">Seller Credentials</h4>
                                </div>
                                <AdminInput label="Seller Email (Login ID)" type="email" placeholder="seller@japura.edu" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} required />
                                <AdminInput label="Seller Password" type="password" placeholder="••••••••" value={sellerPassword} onChange={(e) => setSellerPassword(e.target.value)} required />
                                
                                <div className="md:!col-span-2 !mt-2">
                                    <label className="!block !text-sm !font-bold !text-gray-700 !mb-2">Cover Image</label>
                                    <div className="!border-2 !border-dashed !border-gray-200 !rounded-2xl !p-6 !text-center hover:!border-red-300 hover:!bg-red-50/50 !transition-colors !relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setImageFile(e.target.files[0]);
                                                }
                                            }}
                                            className="!absolute !inset-0 !w-full !h-full !opacity-0"
                                            required
                                        />
                                        <div className="!flex !flex-col !items-center">
                                            <svg className="!w-10 !h-10 !text-gray-400 !mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                            <p className="!text-sm !font-bold !text-[#B52222]">Click to upload image</p>
                                            <p className="!text-xs !text-gray-500 !mt-1">{imageFile ? imageFile.name : 'PNG, JPG up to 5MB'}</p>
                                        </div>
                                    </div>
                                </div>

                                {success && <div className="md:!col-span-2 !bg-green-50 !text-green-700 !p-4 !rounded-xl !text-sm !font-bold !text-center !animate-fade-in-up">{success}</div>}
                                {error && <div className="md:!col-span-2 !bg-red-50 !text-red-700 !p-4 !rounded-xl !text-sm !font-bold !text-center !animate-fade-in-up">{error}</div>}
                            </form>
                        </div>

                        <div className="!p-6 !bg-gray-50 !border-t !border-gray-100 !flex !justify-end !gap-3">
                            <button type="button"
                                onClick={() => setShowAddModal(false)}
                                className="!cursor-pointer !px-6 !py-3 !rounded-xl !font-bold !text-gray-600 hover:!bg-gray-200 !transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                form="addCanteenForm"
                                type="submit"
                                disabled={loading}
                                className="!bg-black hover:!bg-gray-800 !text-white !px-8 !py-3 !rounded-xl !font-bold !shadow-md !transition-colors !flex !items-center !gap-2 disabled:!opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Canteen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Canteen Modal */}
            {editingCanteen && (
                <div className="!fixed !inset-0 !z-[60] !flex !items-center !justify-center !p-4 !bg-black/40 !backdrop-blur-md !animate-fade-in-up">
                    <div className="!bg-white/80 !backdrop-blur-2xl !border !border-white/60 !rounded-[2rem] !shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] !w-full !max-w-2xl !max-h-[90vh] !overflow-hidden !flex !flex-col !relative">
                        <div className="!p-8 !border-b !border-gray-100 !flex !justify-between !items-center !bg-white/80 !backdrop-blur-md !sticky !top-0 !z-10">
                            <div>
                                <h3 className="!text-2xl !font-black !text-gray-900">Edit Canteen</h3>
                                <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Update details for {editingCanteen.name}</p>
                            </div>
                            <button onClick={() => setEditingCanteen(null)}
                                className="!cursor-pointer !p-2 !bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-gray-900 !rounded-full !transition-colors"
                            >
                                <svg className="!w-6 !h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="!p-8 !overflow-y-auto custom-scrollbar !grid !grid-cols-1 md:!grid-cols-2 !gap-x-6 !gap-y-5">
                            <div className="md:!col-span-2">
                                <AdminInput label="Canteen Name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                            </div>
                            <AdminInput label="Location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
                            <AdminInput label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                            <div className="md:!col-span-2">
                                <AdminInput label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                            </div>
                            
                            <div className="!mt-4 md:!col-span-2 !pt-4 !border-t !border-gray-100">
                                <h4 className="!text-sm !font-black !text-gray-900 !uppercase !tracking-wider !mb-4">Seller Credentials</h4>
                            </div>
                            <AdminInput label="Seller Email" type="email" value={editSellerEmail} onChange={(e) => setEditSellerEmail(e.target.value)} required />
                            <AdminInput label="New Password (Optional)" type="password" placeholder="Leave blank to keep current" value={editSellerPassword} onChange={(e) => setEditSellerPassword(e.target.value)} />
                        </div>

                        <div className="!p-6 !bg-gray-50 !border-t !border-gray-100 !flex !justify-end !gap-3">
                            <button onClick={() => setEditingCanteen(null)}
                                className="!cursor-pointer !px-6 !py-3 !rounded-xl !font-bold !text-gray-600 hover:!bg-gray-200 !transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={editLoading}
                                className="!cursor-pointer !bg-[#B52222] hover:!bg-red-800 !text-white !px-8 !py-3 !rounded-xl !font-bold !shadow-md !transition-colors !flex !items-center !gap-2 disabled:!opacity-50"
                            >
                                {editLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.15); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.3); }
            `}} />
        </div>
    );
};

export default CanteenManagement;