"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PublicNavbar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/public' },
        { name: 'Criminal Maps', href: '/public/criminal-maps' },
        { name: 'Chatbot', href: '/public/chatbot' },
        { name: 'Document Summarize', href: '/public/document-summarize' },
        { name: 'Find Case', href: '/public/find-case' },
    ]

    return (
        <nav className="px-6 py-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <Link href="/public" className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-sm">
                        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                        <span className="text-lg font-semibold text-black">CrimeSight</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pathname === item.href
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black hover:bg-gray-50 shadow-sm'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href="/auth/login"
                            className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors ml-2"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}