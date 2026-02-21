// src/components/AuthWrapper.tsx (New Component)
"use client";

import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal"; // Adjust path as necessary

// Define the type for the session user object
interface User {
    email: string;
    // Add other user properties you rely on (id, role, etc.)
}

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // Function to check session and open modal if necessary
    const checkSession = () => {
        const sessionStr = localStorage.getItem("supabase_session");
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                setUser(session.user);
                setIsModalOpen(false);
            } catch (e) {
                // If session string is malformed, force login
                setUser(null);
                setIsModalOpen(true);
            }
        } else {
            setUser(null);
            setIsModalOpen(true);
        }
        setIsCheckingSession(false);
    };

    // Check session on mount
    useEffect(() => {
        checkSession();
        // NOTE: Optional: Re-check session if window visibility changes (e.g., user returns to tab)
        window.addEventListener('focus', checkSession);
        return () => window.removeEventListener('focus', checkSession);
    }, []);
    
    // Pass session functions to the Header for use in logout/login buttons
    const sessionContext = {
        user,
        setUser,
        setIsModalOpen,
        checkSession // Useful for forcing a refresh after login attempt
    };

    // --- RENDER LOGIC ---

    // Don't render content until we know the session status
    if (isCheckingSession) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Session...</div>;
    }
    
    return (
        <>
            {/* The main content of the page */}
            {children} 

            {/* Global Login Modal */}
            {isModalOpen && (
                <LoginModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    // When setUser is called by the modal (successful login), the user state updates, 
                    // and this wrapper re-renders, closing the modal.
                    setUser={setUser} 
                />
            )}
        </>
    );
}