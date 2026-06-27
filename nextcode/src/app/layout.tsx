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
  const isAdminRoute = pathname.startsWith("/admin");

  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAdminRoute) {
      setIsModalOpen(false);
      return;
    }

    const sessionStr = localStorage.getItem("supabase_session");
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setUser(session.user);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [pathname, isAdminRoute]);

  return (
    <html lang="en">
      {/*
        ✅ FIX 1: body MUST be bg-transparent
           backdrop-blur / backdrop-filter only works when the element behind it
           is NOT opaque. Default <body> is white (opaque), which blocks blur entirely.
           Setting bg-transparent lets the fixed background div show through.
      */}
      <body className={`${inter.className} bg-transparent`}>

        {/* Global Dynamic Background — fixed, behind everything */}
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: -1,
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: '5%', left: '10%',
            width: '400px', height: '400px',
            background: 'rgba(181, 34, 34, 0.25)',
            filter: 'blur(100px)', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '5%',
            width: '500px', height: '500px',
            background: 'rgba(245, 158, 11, 0.25)',
            filter: 'blur(120px)', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '30%',
            width: '600px', height: '600px',
            background: 'rgba(59, 130, 246, 0.15)',
            filter: 'blur(120px)', borderRadius: '50%',
          }} />
        </div>

        <CartProvider>
          {!isAdminRoute && (
            <Header
              user={user}
              setUser={setUser}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {/*
            ✅ FIX 2: main wrapper gives correct top padding for fixed header.
               Without this, page content starts at y=0 (behind the navbar).
               pt-16 = 64px — adjust to match your Header height if different.
          */}
          <main className={!isAdminRoute ? "pt-16" : ""}>
            {children}
          </main>

          <FoodModal />
        </CartProvider>

        {!isAdminRoute && isModalOpen && (
          <LoginModal
            isOpen={true}
            onClose={() => {
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