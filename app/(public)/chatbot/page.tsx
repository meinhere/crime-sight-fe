'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChatHistory, ChatMessage, chatHistoryData } from '@/data/chat-data'
import { ChatSidebar } from '@/components/chatbot/chat-sidebar'
import { ChatArea } from '@/components/chatbot/chat-area'
import { ChatExitButton } from '@/components/chatbot/chat-exit-button'

export default function ChatbotPage() {
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>(chatHistoryData)
    const [activeChatId, setActiveChatId] = useState<string | null>(null)
    const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Override body scroll when component mounts
    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
        }
    }, [])

    // Handle chat selection
    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId)
        const chat = chatHistory.find(c => c.id === chatId)
        setCurrentMessages(chat?.messages || [])
        // Close sidebar on mobile after selection
        setIsSidebarOpen(false)
    }

    // Handle new chat
    const handleNewChat = () => {
        setActiveChatId(null)
        setCurrentMessages([])
        setIsSidebarOpen(false)
    }

    // Handle send message
    const handleSendMessage = async (messageContent: string) => {
        if (!messageContent.trim()) return

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content: messageContent,
            sender: 'user',
            timestamp: new Date(),
            chatId: activeChatId || 'new'
        }

        setCurrentMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        setTimeout(() => {
            const botMessage: ChatMessage = {
                id: `msg-${Date.now()}-bot`,
                content: generateBotResponse(messageContent),
                sender: 'bot',
                timestamp: new Date(),
                chatId: activeChatId || 'new'
            }

            setCurrentMessages(prev => [...prev, botMessage])
            setIsLoading(false)

            if (!activeChatId) {
                const newChatId = `chat-${Date.now()}`
                const newChat: ChatHistory = {
                    id: newChatId,
                    title: messageContent.slice(0, 30) + (messageContent.length > 30 ? '...' : ''),
                    lastMessage: botMessage.content,
                    timestamp: new Date(),
                    messages: [userMessage, botMessage]
                }

                setChatHistory(prev => [newChat, ...prev])
                setActiveChatId(newChatId)
            } else {
                setChatHistory(prev => prev.map(chat =>
                    chat.id === activeChatId
                        ? {
                            ...chat,
                            lastMessage: botMessage.content,
                            timestamp: new Date(),
                            messages: [...chat.messages, userMessage, botMessage]
                        }
                        : chat
                ))
            }
        }, 1000)
    }

    const generateBotResponse = (userMessage: string): string => {
        const responses = [
            'Terima kasih atas pertanyaan Anda. Berdasarkan hukum Indonesia...',
            'Dalam konteks hukum pidana, hal tersebut diatur dalam...',
            'Menurut peraturan yang berlaku...',
            'Untuk kasus seperti ini, biasanya...',
            'Saya dapat membantu menjelaskan bahwa...',
            'Berdasarkan analisis data kejahatan...',
            'Sistem clustering menunjukkan bahwa...',
            'Dari perspektif kriminologi...'
        ]
        return responses[Math.floor(Math.random() * responses.length)]
    }

    return (
        <div className="fixed inset-0 bg-gray-50 z-[9999] overflow-hidden">
            {/* Exit Button - Hide when sidebar is open on mobile */}
            <ChatExitButton isHidden={isSidebarOpen} />

            {/* Chat Container */}
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <ChatSidebar
                    chatHistory={chatHistory}
                    activeChatId={activeChatId}
                    onChatSelect={handleChatSelect}
                    onNewChat={handleNewChat}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Chat Area */}
                <ChatArea
                    messages={currentMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>
        </div>
    )
}