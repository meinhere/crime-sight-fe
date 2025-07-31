'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/data/chat-data'
import { ChatMessageComponent } from '@/components/chatbot/chat-message'
import { ChatInput } from '@/components/chatbot/chat-input'

interface ChatAreaProps {
    messages: ChatMessage[]
    onSendMessage: (message: string) => void
    isLoading?: boolean
}

export function ChatArea({ messages, onSendMessage, isLoading }: ChatAreaProps) {
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
        <div className="flex-1 flex flex-col bg-white h-full">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 bg-white flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
                <p className="text-sm text-gray-500">
                    AI chatbot untuk komunikasi yang lebih baik dan alur kerja yang lebih sederhana
                </p>
            </div>

            {/* Messages Area - Single scroll container */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <p className="text-lg mb-2">Mulai percakapan baru</p>
                                <p className="text-sm">Ketik pesan atau pilih chat dari sidebar</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <ChatMessageComponent key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white rounded-full"></div>
                                    </div>
                                    <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0">
                    <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
                </div>
            </div>
        </div>
    )
}