// src/app/admin/components/UserManagement.tsx
import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    full_name: string;
    email: string;
    mobile: string;
    role: string;
    student_reg_no?: string;
    lecture_id?: string;
    staff_id?: string;
    faculty?: string;
    position?: string;
    created_at: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    // Fetch users on mount
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/api/users');
            const result = await res.json();
            if (res.ok) {
                setUsers(result.data || []);
            } else {
                setError(result.error || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('An error occurred while fetching users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (confirm(`Are you absolutely sure you want to permanently delete user "${userName}"? This action cannot be undone.`)) {
            try {
                const res = await fetch('/admin/api/users', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId })
                });

                if (res.ok) {
                    // Update state to remove deleted user
                    setUsers(users.filter(u => u.id !== userId));
                } else {
                    const data = await res.json();
                    alert(`Failed to delete user: ${data.error}`);
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('An error occurred while deleting the user.');
            }
        }
    };

    const filteredUsers = users.filter(u => {
        const idSearchStr = u.student_reg_no || u.lecture_id || u.staff_id || '';
        const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              idSearchStr.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="!animate-fade-in-up !relative">
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-8 !gap-4">
                <div>
                    <h2 className="!text-3xl !font-extrabold !text-gray-900 !tracking-tight">User Management</h2>
                    <p className="!text-sm !font-semibold !text-gray-500 !mt-1">Manage platform users, view their details, and moderate accounts.</p>
                </div>
                <div className="!bg-white/60 !backdrop-blur-xl !px-5 !py-2.5 !rounded-2xl !shadow-sm !border !border-white/60 !flex !items-center !gap-3">
                    <span className="!text-sm !font-bold !text-gray-600">Total Users</span>
                    <span className="!bg-[#B52222] !text-white !px-3 !py-1 !rounded-full !text-sm !font-bold">{users.length}</span>
                </div>
            </div>

            {error && (
                <div className="!bg-red-50/80 !backdrop-blur-md !border !border-red-200 !text-red-700 !px-4 !py-3 !rounded-xl !mb-6 !font-semibold">
                    {error}
                </div>
            )}

            {/* Controls */}
            <div className="!flex !flex-col md:!flex-row !gap-4 !mb-6">
                <div className="!flex-1 !relative">
                    <input 
                        type="text" 
                        placeholder="Search by name, email or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="!w-full !pl-12 !pr-4 !py-3.5 !bg-white/60 !backdrop-blur-xl !border !border-white/60 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !rounded-2xl focus:!outline-none focus:!ring-2 focus:!ring-red-500/20 focus:!bg-white/90 !transition-all !font-medium"
                    />
                    <svg className="!w-5 !h-5 !text-gray-400 !absolute !left-4 !top-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <select 
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="!px-5 !py-3.5 !bg-white/60 !backdrop-blur-xl !border !border-white/60 !shadow-[0_4px_20px_rgb(0,0,0,0.03)] !rounded-2xl focus:!outline-none focus:!ring-2 focus:!ring-red-500/20 focus:!bg-white/90 !transition-all !font-bold !text-gray-700 !cursor-pointer !min-w-[150px]"
                >
                    <option value="All">All Roles</option>
                    <option value="student">Students</option>
                    <option value="lecturer">Lecturers</option>
                    <option value="staff">Staff</option>
                </select>
            </div>

            {/* Glassmorphism Table Wrapper */}
            <div className="!bg-white/60 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !shadow-[0_8px_30px_rgb(0,0,0,0.04)] !overflow-hidden">
                <div className="!overflow-x-auto">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-white/40 !border-b !border-white/60">
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">User Info</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">Role & ID</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider">Contact</th>
                                <th className="!px-8 !py-5 !text-xs !font-black !text-gray-500 !uppercase !tracking-wider !text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-white/40">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="!text-center !py-12">
                                        <div className="!inline-flex !items-center !gap-3 !text-gray-500 !font-semibold">
                                            <svg className="!animate-spin !h-5 !w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Loading Users...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="!text-center !py-12 !text-gray-500 !font-semibold">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const roleColors: Record<string, string> = {
                                        student: '!bg-blue-100 !text-blue-800',
                                        lecturer: '!bg-purple-100 !text-purple-800',
                                        staff: '!bg-orange-100 !text-orange-800'
                                    };
                                    
                                    const userIdNumber = user.student_reg_no || user.lecture_id || user.staff_id || 'N/A';
                                    const deptInfo = user.faculty || user.position || '';

                                    return (
                                        <tr key={user.id} className="hover:!bg-white/50 !transition-colors !group">
                                            <td className="!px-8 !py-5">
                                                <div className="!flex !items-center !gap-4">
                                                    <div className="!w-12 !h-12 !rounded-full !bg-gradient-to-br !from-gray-100 !to-white !shadow-sm !border !border-gray-200/50 !flex !items-center !justify-center !font-black !text-gray-700 !text-lg">
                                                        {user.full_name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="!font-bold !text-gray-900 !text-[15px]">{user.full_name}</div>
                                                        <div className="!text-xs !font-semibold !text-gray-500 !mt-0.5">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!px-8 !py-5">
                                                <div className="!flex !flex-col !items-start !gap-1.5">
                                                    <span className={`!inline-flex !items-center !px-2.5 !py-1 !rounded-md !text-[10px] !font-bold !uppercase !tracking-wider ${roleColors[user.role] || '!bg-gray-100 !text-gray-800'}`}>
                                                        {user.role}
                                                    </span>
                                                    <div className="!text-sm !font-bold !text-gray-700">{userIdNumber}</div>
                                                    {deptInfo && <div className="!text-xs !font-semibold !text-gray-500">{deptInfo}</div>}
                                                </div>
                                            </td>
                                            <td className="!px-8 !py-5">
                                                <div className="!text-sm !font-semibold !text-gray-700">{user.mobile || 'No Mobile'}</div>
                                                <div className="!text-xs !text-gray-400 !mt-1">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="!px-8 !py-5 !text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.full_name)}
                                                    className="!inline-flex !items-center !justify-center !w-10 !h-10 !rounded-xl !bg-white/80 !border !border-red-100 !text-red-600 hover:!bg-red-50 hover:!border-red-200 !shadow-sm hover:!shadow !transition-all !opacity-50 group-hover:!opacity-100"
                                                    title="Delete User"
                                                >
                                                    <svg className="!w-5 !h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
};

export default UserManagement;
