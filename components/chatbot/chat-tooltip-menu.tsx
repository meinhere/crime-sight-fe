'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconHome, IconChartBar, IconUsers, IconSettings, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'

export function ChatTooltipMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const menuItems = [
        {
            icon: IconHome,
            label: 'Home',
            href: '/',
            color: 'text-blue-600 hover:bg-blue-50'
        },
        {
            icon: IconChartBar,
            label: 'Dashboard',
            href: '/dashboard',
            color: 'text-green-600 hover:bg-green-50'
        },
        {
            icon: IconUsers,
            label: 'Data Kejahatan',
            href: '/data-kejahatan',
            color: 'text-purple-600 hover:bg-purple-50'
        },
        {
            icon: IconSettings,
            label: 'Settings',
            href: '/settings',
            color: 'text-gray-600 hover:bg-gray-50'
        }
    ]

    const handleNavigation = (href: string) => {
        // Re-enable body scroll before navigation
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''

        router.push(href)
        setIsOpen(false)
    }

    return (
        <>
            {/* Blur Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[9998]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Container - Top Right */}
            <div className="fixed top-4 right-4 z-[10000]">
                {/* Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
                >
                    {isOpen ? (
                        <IconX className="w-5 h-5 text-gray-600" />
                    ) : (
                        <IconMenu2 className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-40 animate-in slide-in-from-top-2 duration-200">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleNavigation(item.href)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${item.color}`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1" />

                        {/* Exit Chat */}
                        <button
                            onClick={() => handleNavigation('/')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <IconLogout className="w-4 h-4" />
                            <span className="font-medium">Exit Chat</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}