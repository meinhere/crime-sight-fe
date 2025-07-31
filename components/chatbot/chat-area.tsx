'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/data/chat-data'
import { ChatMessageComponent } from '@/components/chatbot/chat-message'
import { ChatInput } from '@/components/chatbot/chat-input'

interface ChatAreaProps {
    messages: ChatMessage[]
    onSendMessage: (message: string) => void
    isLoading?: boolean
    isSidebarOpen?: boolean
    onToggleSidebar?: () => void
}

export function ChatArea({
    messages,
    onSendMessage,
    isLoading,
    isSidebarOpen,
    onToggleSidebar
}: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom()
        }
    }, [messages])

    return (
        <div className="flex-1 flex flex-col bg-white h-full min-h-0">
            {/* Header with Mobile Menu Button */}
            <div className="border-b border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0 flex items-center gap-3">
                {/* Mobile Hamburger Button */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Header Content */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">Chat Assistant</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                        AI chatbot untuk komunikasi yang lebih baik
                    </p>
                </div>
            </div>

            {/* Messages Area - Full height */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full min-h-[50vh]">
                            <div className="text-center text-gray-500 px-4 w-full max-w-sm">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Mulai percakapan baru</p>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    Ketik pesan atau pilih chat dari sidebar
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4 pb-4">
                            {messages.map((message) => (
                                <ChatMessageComponent key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 sm:gap-3 items-start">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                    </div>
                                    <div className="bg-gray-100 border border-gray-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-200">
                    <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
                </div>
            </div>
        </div>
    )
}