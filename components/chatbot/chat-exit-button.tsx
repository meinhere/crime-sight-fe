'use client'

import { useRouter } from 'next/navigation'
import { IconX } from '@tabler/icons-react'

export function ChatExitButton() {
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
            className="fixed top-4 right-4 z-[10000] w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group"
            title="Exit Chat"
        >
            <IconX className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>
    )
}