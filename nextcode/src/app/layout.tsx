"use client";

import "./globals.css";
import { Inter } from "next/font/google";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { CartProvider } from "./components/CartContext";
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

        {/* Show Header ONLY on client-side user pages */}
        {!isAdminRoute && (
          <Header
            user={user}
            setUser={setUser}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* Cart Context wraps all pages */}
        <CartProvider>
          {children}
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
