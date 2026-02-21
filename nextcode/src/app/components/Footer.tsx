"use client";

import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  quickLinks?: FooterLink[];
  socialLinks?: FooterLink[];
  contactPhone?: string;
  contactEmail?: string;
  className?: string;
}

const defaultQuickLinks: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Canteens", href: "/canteens" },
  { label: "Orders", href: "/orders" },
  { label: "Shopping cart", href: "/checkout" },
];

const defaultSocialLinks: FooterLink[] = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
];

export default function Footer({
  quickLinks = defaultQuickLinks,
  socialLinks = defaultSocialLinks,
  contactPhone = "+94 77 123 4567",
  contactEmail = "info@japuraeats.lk",
  className = "",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
<footer className={`${className} ${inter.className} w-full bg-[rgb(var(--color-hero-bg))]/[0.69]`}>
  {/* Main Footer with guaranteed large vertical space */}
  <div className="container mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Brand Section */}
      <div className="flex flex-col gap-3">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/landing/logo.png"
            width={50}
            height={50}
            alt="JAPURA EATS Logo"
            className="object-contain"
          />
          <h2 className="text-xl font-bold text-[#B52222]">JAPURA EATS</h2>
        </a>
        <p className="text-sm text-black italic">The Easier Way to Eat at Japura.</p>
      </div>

      {/* Quick Links & Socials */}
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-sm font-semibold text-black mb-2">Quick Links:</h4>
          <div className="flex flex-wrap gap-x-2">
            {quickLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-black hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </a>
                {index < quickLinks.length - 1 && <span className="text-black">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-black mb-2">Socials:</h4>
          <div className="flex flex-wrap gap-x-2">
            {socialLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-black hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </a>
                {index < socialLinks.length - 1 && <span className="text-black">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-black mb-2">Contact:</h4>
        <a
          href={`tel:${contactPhone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-sm text-black hover:opacity-70 transition-opacity"
        >
          📞 {contactPhone}
        </a>
        <a
          href={`mailto:${contactEmail}`}
          className="flex items-center gap-2 text-sm text-black hover:opacity-70 transition-opacity"
        >
          ✉️ {contactEmail}
        </a>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="bg-gray-800 py-4">
    <div className="container mx-auto px-4">
      <p className="text-center text-sm text-white">
        © {currentYear} JAPURA EATS. All Rights Reserved.
      </p>
    </div>
  </div>
</footer>


  );
}
