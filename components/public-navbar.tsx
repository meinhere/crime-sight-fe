"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'

export function PublicNavbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Criminal Maps', href: '/criminal-maps' },
        { name: 'Chatbot', href: '/chatbot' },
        { name: 'Document Summarize', href: '/document-summarize' },
        { name: 'Find Case', href: '/find-case' },
    ]

    // Helper function untuk handle active state
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(href)
    }

    // Close mobile menu when link is clicked
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false)
    }

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
                                        ? 'bg-black text-white shadow-md'
                                        : 'bg-white text-black hover:bg-gray-50 hover:shadow-md shadow-sm'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200 ml-3"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Tablet Navigation (medium screens) */}
                    <div className="hidden md:flex lg:hidden items-center space-x-1">
                        {navItems.slice(0, 3).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${isActive(item.href)
                                        ? 'bg-black text-white shadow-md'
                                        : 'bg-white text-black hover:bg-gray-50 hover:shadow-md shadow-sm'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* More menu button for tablet */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="px-3 py-2 rounded-full text-xs font-medium bg-white text-black hover:bg-gray-50 hover:shadow-md shadow-sm transition-all duration-200"
                        >
                            More
                        </button>

                        <Link
                            href="/login"
                            className="px-3 py-2 rounded-full text-xs font-medium bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200 ml-2"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 z-50 relative"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <IconX className="w-6 h-6 text-black" />
                        ) : (
                            <IconMenu2 className="w-6 h-6 text-black" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:lg:hidden" onClick={handleLinkClick} />
                )}

                {/* Mobile Menu */}
                <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="p-6 pt-20">
                        <div className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`block w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-black text-white'
                                            : 'bg-gray-50 text-black hover:bg-gray-100'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-gray-200">
                                <Link
                                    href="/login"
                                    onClick={handleLinkClick}
                                    className="block w-full px-4 py-3 rounded-lg text-center font-medium bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tablet Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="hidden md:block lg:hidden absolute top-full right-4 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4 space-y-2">
                            {navItems.slice(3).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`block w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-black text-white'
                                            : 'bg-gray-50 text-black hover:bg-gray-100'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}