"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PublicNavbar() {
    const pathname = usePathname()

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

    return (
        <nav className="px-4 py-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                        <span className="text-lg font-semibold text-black">CrimeSight</span>
                    </Link>

                    <div className="flex items-center space-x-2">
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
                </div>
            </div>
        </nav>
    )
}