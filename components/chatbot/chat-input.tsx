'use client'

import { useState } from 'react'
import { IconSend } from '@tabler/icons-react'

interface ChatInputProps {
    onSendMessage: (message: string) => void
    disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && !disabled) {
            onSendMessage(message.trim())
            setMessage('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="border-t border-gray-200 p-3 lg:p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2 lg:gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a new message here"
                        disabled={disabled}
                        className="w-full px-3 py-2.5 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 placeholder:text-gray-400"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                    <IconSend className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
            </form>
        </div>
    )
}