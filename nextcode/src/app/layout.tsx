"use client";

import "./globals.css";
import { Inter } from "next/font/google";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { CartProvider } from "./components/CartContext";
import FoodModal from "./components/FoodModal";
import LoginModal from "./components/LoginModal";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin"); // detect admin pages

  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** HANDLE USER SESSION FOR CLIENT SIDE ONLY (NON-ADMIN) */
  useEffect(() => {
    if (isAdminRoute) {
      // Admin pages never auto-open user login modal
      setIsModalOpen(false);
      return;
    }

    // USER ROUTE LOGIN CHECK
    const sessionStr = localStorage.getItem("supabase_session");

    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setUser(session.user);
      setIsModalOpen(false);     // hide modal if logged in
    } else {
      setIsModalOpen(true);      // always show modal for guests
    }
  }, [pathname, isAdminRoute]);

  return (
    <html lang="en">
      <body className={inter.className}>

        {/* Global Dynamic Background */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '5%', left: '10%', width: '400px', height: '400px',
            background: 'rgba(181, 34, 34, 0.25)', 
            filter: 'blur(100px)', borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute', top: '20%', right: '5%', width: '500px', height: '500px',
            background: 'rgba(245, 158, 11, 0.25)', 
            filter: 'blur(120px)', borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute', bottom: '10%', left: '30%', width: '600px', height: '600px',
            background: 'rgba(59, 130, 246, 0.15)', 
            filter: 'blur(120px)', borderRadius: '50%'
          }}></div>
        </div>

        {/* Cart Context wraps all pages */}
        <CartProvider>
          {/* Show Header ONLY on client-side user pages */}
          {!isAdminRoute && (
            <Header
              user={user}
              setUser={setUser}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}
          {children}
          {/* Global Food Modal */}
          <FoodModal />
        </CartProvider>

        {/* User Login Modal -> ONLY on user pages */}
        {!isAdminRoute && isModalOpen && (
          <LoginModal
            isOpen={true}
            onClose={() => {
              // disable closing unless a session exists
              const sessionStr = localStorage.getItem("supabase_session");
              if (!sessionStr) return; 
              setIsModalOpen(false);
            }}
            setUser={(user: any) => {
              setUser(user);
              setIsModalOpen(false);
            }}
          />
        )}

      </body>
    </html>
  );
}
