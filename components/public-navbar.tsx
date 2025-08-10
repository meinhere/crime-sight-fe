"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import React from "react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Criminal Maps", href: "/criminal-maps" },
    { name: "Find Case", href: "/find-case" },
  ];

  // Helper function untuk handle active state
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Close mobile menu when link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="px-4 py-4 relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow z-50 relative"
            onClick={handleLinkClick}
          >
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold text-black">CrimeSight</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-black hover:bg-gray-50 hover:shadow-md shadow-sm"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Tablet Navigation (medium screens) */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${isActive(item.href)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-black hover:bg-gray-50 hover:shadow-md shadow-sm"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* ✅ Mobile Menu Container - Contains both button and popup */}
          <div className="md:hidden relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 z-50 relative"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <IconX className="w-6 h-6 text-black" />
              ) : (
                <IconMenu2 className="w-6 h-6 text-black" />
              )}
            </button>

            {/* ✅ Mobile Popup Menu - With blur backdrop */}
            {isMobileMenuOpen && (
              <>
                {/* ✅ Blur Backdrop */}
                <div
                  className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40"
                  onClick={handleLinkClick}
                />

                {/* Popup Menu */}
                <div className="absolute top-0 right-0 mt-12 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 z-50 transform transition-all duration-200 ease-out">
                  <div className="p-4 space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`block w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${isActive(item.href)
                          ? "bg-black text-white"
                          : "bg-gray-50/80 text-black hover:bg-gray-100/80"
                          }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}