'use client'

import { useRouter } from 'next/navigation'
import { IconX } from '@tabler/icons-react'

interface ChatExitButtonProps {
    isHidden?: boolean
}

export function ChatExitButton({ isHidden }: ChatExitButtonProps) {
    const router = useRouter()

    const handleExit = () => {
        // Re-enable body scroll before navigation
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''

        router.push('/')
    }

    return (
        <button
            onClick={handleExit}
            className={`fixed top-3 right-3 lg:top-4 lg:right-4 z-[10000] w-9 h-9 lg:w-10 lg:h-10 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            title="Exit Chat"
        >
            <IconX className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
    )
}