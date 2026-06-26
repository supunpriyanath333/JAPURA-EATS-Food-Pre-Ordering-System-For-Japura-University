"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  quickLinks?: FooterLink[];
  contactPhone?: string;
  contactEmail?: string;
  className?: string;
}

const defaultQuickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Canteens", href: "/canteens" },
  { label: "Orders", href: "/orders" },
  { label: "Cart", href: "/checkout" },
  { label: "About", href: "/about" },
];

export default function Footer({
  quickLinks = defaultQuickLinks,
  contactPhone = "+94 77 123 4567",
  contactEmail = "info@japuraeats.lk",
  className = "",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={className} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        .ftr {
          background: linear-gradient(135deg, #4d4a02ff 0%, #45430fff 50%, #6f1e1eff 100%);
          color: #fffbeb;
          position: relative;
          overflow: hidden;
          border-top:1px solid #151212ff;
        }

        .ftr-main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 4rem 2rem 3rem;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 3rem;
        }
        @media (max-width: 1024px) {
          .ftr-main { grid-template-columns: 1fr 1fr; gap: 2.5rem; padding: 3rem 1.5rem 2.5rem; }
        }
        @media (max-width: 640px) {
          .ftr-main { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem 1rem 2rem; }
        }

        /* Brand */
        .ftr-brand-tagline {
          font-size: 0.85rem;
          color: #e3dcb8;
          line-height: 1.6;
          margin-top: 0.75rem;
          max-width: 260px;
          opacity: 0.95;
        }
        .ftr-brand-name {
          font-size: 1.55rem;
          font-weight: 900;
          color: #f4f1de;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        /* Badges */
        .ftr-badges {
          display: flex;
          gap: 8px;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }
        .ftr-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: rgba(244, 241, 222, 0.1);
          border: 1px solid rgba(235, 213, 115, 0.3);
          border-radius: 99px;
          font-size: 0.75rem;
          color: #ebd573;
          font-weight: 600;
        }

        /* Sections */
        .ftr-section-title {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ebd573;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ftr-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(235, 213, 115, 0.2);
        }

        /* Links */
        .ftr-links {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .ftr-link {
          font-size: 0.9rem;
          color: #e3dcb8;
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ftr-link:hover {
          color: #ebd573;
          transform: translateX(4px);
        }
        .ftr-link-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ebd573;
          opacity: 0.8;
          flex-shrink: 0;
        }

        /* Social icons */
        .ftr-socials {
          display: flex;
          gap: 10px;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .ftr-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(244, 241, 222, 0.1);
          border: 1px solid rgba(235, 213, 115, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f4f1de;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .ftr-social-btn:hover {
          background: rgba(244, 241, 222, 0.2);
          border-color: rgba(235, 213, 115, 0.5);
          color: #ebd573;
          transform: translateY(-2px);
        }

        /* Contact */
        .ftr-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        .ftr-contact-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(244, 241, 222, 0.1);
          border: 1px solid rgba(235, 213, 115, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ece2e2ff;
          flex-shrink: 0;
        }
        .ftr-contact-label {
          font-size: 0.7rem;
          color: #e3dcb8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.8;
        }
        .ftr-contact-value {
          font-size: 0.88rem;
          color: #f4f1de;
          margin-top: 1px;
          transition: color 0.2s;
        }
        .ftr-contact-item:hover .ftr-contact-value {
          color: #ebd573;
        }

        /* Bottom bar */
        .ftr-bottom {
          border-top: 1px solid rgba(244, 241, 222, 0.15);
          max-width: 1440px;
          margin: 0 auto;
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ftr-copy {
          font-size: 0.8rem;
          color: #e3dcb8;
          opacity: 0.9;
        }
        .ftr-copy span {
          color: #ebd573;
          font-weight: 700;
          opacity: 1;
        }
        .ftr-made {
          font-size: 0.78rem;
          color: #5a4830;
        }
        .ftr-made span {
          color: #B52222;
        }
      `}</style>

      <div className="ftr">
        {/* Main grid */}
        <div className="ftr-main">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image src="/landing/logo.png" width={110} height={110} alt="JAPURA EATS" style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="ftr-brand-name" style={{ fontSize: '1.7rem', lineHeight: '1.1' }}>JAPURA EATS</span>
                <span style={{ fontSize: '0.85rem', color: '#ebd573', fontStyle: 'italic', justifyContent: 'center', marginTop: '4px' }}>The Easier Way to Eat at Japura.</span>
              </div>
            </Link>
            <p className="ftr-brand-tagline" style={{ marginTop: '1.25rem' }}>
              Pre-order your favourite meals from university canteens — skip the queue, eat smarter.
            </p>
            <div className="ftr-badges">
              <span className="ftr-badge">🏛 Japura University</span>
              <span className="ftr-badge">⚡ Fast Pre-order</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ftr-section-title">Quick Links</div>
            <nav className="ftr-links">
              {quickLinks.map((link) => (
                <Link key={link.label} href={link.href} className="ftr-link">
                  <span className="ftr-link-dot" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <div className="ftr-section-title">Follow Us</div>
            <div className="ftr-socials">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ftr-social-btn" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ftr-social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="ftr-social-btn" title="X (Twitter)">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="ftr-social-btn" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

            {/* Hours */}
            <div style={{ marginTop: '1.5rem' }}>
              <div className="ftr-section-title">Opening Hours</div>
              <div style={{ fontSize: '0.85rem', color: '#c8b888', lineHeight: '2' }}>
                <div>🕗 Mon – Fri: &nbsp;<strong style={{ color: '#f0d090' }}>7:00 AM – 5:00 PM</strong></div>
                <div>🕘 Saturday: &nbsp;<strong style={{ color: '#f0d090' }}>8:00 AM – 2:00 PM</strong></div>
                <div>❌ Sunday: &nbsp;<span style={{ color: '#8a7050' }}>Closed</span></div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="ftr-section-title">Contact</div>

            <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="ftr-contact-item">
              <div className="ftr-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <div className="ftr-contact-label">Phone</div>
                <div className="ftr-contact-value">{contactPhone}</div>
              </div>
            </a>

            <a href={`mailto:${contactEmail}`} className="ftr-contact-item">
              <div className="ftr-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="ftr-contact-label">Email</div>
                <div className="ftr-contact-value">{contactEmail}</div>
              </div>
            </a>

            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="ftr-contact-item">
              <div className="ftr-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="ftr-contact-label">Location</div>
                <div className="ftr-contact-value">Japura University, Kelaniya</div>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="ftr-bottom">
          <p className="ftr-copy">© {currentYear} <span>JAPURA EATS</span>. All Rights Reserved.</p>
          <p className="ftr-made">Made with <span>♥</span> for Japura University Students</p>
        </div>

      </div>
    </footer>
  );
}
