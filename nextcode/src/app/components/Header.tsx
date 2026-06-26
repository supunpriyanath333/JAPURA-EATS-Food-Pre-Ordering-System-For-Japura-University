"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface HeaderProps {
  user: any;
  setUser: any;
  navItems?: NavItem[];
  className?: string;
  cartNotificationActive?: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const defaultNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    label: "Canteens",
    href: "/canteens",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/orders",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export default function Header({
  user,
  setUser,
  navItems = defaultNavItems,
  className = "",
  isModalOpen,
  setIsModalOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("supabase_session");
    setUser(null);
    setShowLogoutConfirm(false);
    setIsModalOpen(true);
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <>
      <style>{`
        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .hdr-bar {
          background: rgba(222, 222, 188, 0.84);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid rgba(181, 34, 34, 0.12);
          box-shadow: 0 2px 16px rgba(120, 60, 0, 0.08);
          transition: all 0.3s ease;
        }
        .hdr.scrolled .hdr-bar {
          background: rgba(222, 222, 188, 0.84);
          box-shadow: 0 4px 24px rgba(120, 60, 0, 0.12);
        }
        .hdr-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          height: 70px;
          transition: height 0.3s ease;
        }
        @media (max-width: 768px) {
          .hdr-inner {
            padding: 0 1rem;
          }
        }
        .hdr.scrolled .hdr-inner {
          height: 62px;
        }

        /* Logo */
        .hdr-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 32px;
        }
        .hdr-logo-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #B52222;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .hdr-logo-sub {
          font-size: 0.72rem;
          color: #8b6914;
          font-style: italic;
          margin-top: 2px;
        }

        /* Nav */
        .hdr-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .hdr-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #5c3d10;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }
        .hdr-nav-link:hover {
          color: #B52222;
          background: rgba(181, 34, 34, 0.08);
        }
        .hdr-nav-link.active {
          color: #B52222;
          background: rgba(181, 34, 34, 0.12);
          font-weight: 700;
        }
        .hdr-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2.5px;
          background: #B52222;
          border-radius: 99px;
        }

        /* Right Actions */
        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .hdr-divider {
          width: 1px;
          height: 24px;
          background: rgba(139, 105, 20, 0.22);
          margin: 0 4px;
        }

        /* Icon Btn */
        .hdr-icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 11px;
          cursor: pointer;
          color: #6b4c14;
          transition: all 0.2s ease;
          position: relative;
        }
        .hdr-icon-btn:hover {
          background: rgba(181, 34, 34, 0.10);
          color: #B52222;
        }

        /* Cart Btn */
        .hdr-cart-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px 8px 12px;
          background: rgba(181, 34, 34, 0.10);
          border: 1.5px solid rgba(181, 34, 34, 0.18);
          border-radius: 12px;
          cursor: pointer;
          color: #B52222;
          font-weight: 700;
          font-size: 0.92rem;
          transition: all 0.2s ease;
          text-decoration: none;
          position: relative;
        }
        .hdr-cart-btn:hover {
          background: rgba(181, 34, 34, 0.16);
          border-color: rgba(181, 34, 34, 0.3);
          transform: translateY(-1px);
        }
        .hdr-cart-badge {
          background: #B52222;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          min-width: 20px;
          height: 20px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          line-height: 1;
        }
        .hdr-cart-badge.bounce {
          animation: cartBounce 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        @keyframes cartBounce {
          0%,100% { transform: scale(1); }
          30% { transform: scale(1.5); }
          60% { transform: scale(0.88); }
        }

        /* Sign In Btn */
        .hdr-signin-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          background: linear-gradient(135deg, #B52222 0%, #d43333 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(181, 34, 34, 0.3);
        }
        .hdr-signin-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(181, 34, 34, 0.4);
        }

        /* Profile Avatar */
        .hdr-avatar {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #B52222 0%, #e05c2a 100%);
          color: white;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid rgba(181, 34, 34, 0.3);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .hdr-avatar:hover {
          transform: scale(1.06);
          box-shadow: 0 4px 14px rgba(181, 34, 34, 0.35);
        }

        /* Logout Btn */
        .hdr-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: rgba(181, 34, 34, 0.05);
          color: #B52222;
          border: 1.5px solid rgba(181, 34, 34, 0.15);
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.4s ease;
          margin-left: 2px;
        }
        .hdr-logout-btn:hover {
          background: rgba(181, 34, 34, 0.12);
          color: #8f1919;
          border-color: rgba(181, 34, 34, 0.25);
          transform: translateY(-1px);
        }
      `}</style>

      <header className={`hdr ${scrolled ? "scrolled" : ""} ${className}`}>
        <div className="hdr-bar">
          <div className="hdr-inner">

            {/* Logo */}
            <Link href="/" className="hdr-logo">
              <Image src="/landing/logo.png" width={50} height={50} alt="Japura Eats" style={{ objectFit: "contain" }} />
              <div className="hidden md:block">
                <div className="hdr-logo-title">JAPURA EATS</div>
                <div className="hdr-logo-sub">The Easier Way to Eat at Japura.</div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hdr-nav hidden md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href} className={`hdr-nav-link ${isActive ? "active" : ""}`}>
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hdr-actions">

              {/* Notification */}
              <button className="hdr-icon-btn" aria-label="Notifications">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Cart - proper shopping cart icon */}
              <Link href="/checkout" id="header-cart-icon" className="hdr-cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className={`hdr-cart-badge ${cartBounce ? "bounce" : ""}`}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <div className="hdr-divider" />

              {/* Profile Avatar & Logout */}
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link href="/profile" className="hdr-avatar" title={user.email}>
                    {userInitial}
                  </Link>
                  <button className="hdr-logout-btn" onClick={handleLogoutClick} title="Logout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button className="hdr-signin-btn" onClick={() => setIsModalOpen(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            maxWidth: '380px',
            width: '90%',
            textAlign: 'center',
            animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(181,34,34,0.1)',
              color: '#B52222', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Log Out?</h3>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '28px' }}>Are you sure you want to sign out from your Japura Eats account?</p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: '12px', background: '#f0f0f0', color: '#444',
                  border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e5e5e5'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f0f0f0'}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1, padding: '12px', background: '#B52222', color: 'white',
                  border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#9e1c1c'}
                onMouseOut={(e) => e.currentTarget.style.background = '#B52222'}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}