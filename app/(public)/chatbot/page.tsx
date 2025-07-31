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

    // Override body scroll when component mounts
    useEffect(() => {
        // Disable body scroll
        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        // Re-enable body scroll when component unmounts
        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
        }
    }, [])

    // Get current chat messages
    const getCurrentMessages = useCallback(() => {
        if (!activeChatId) return []
        const chat = chatHistory.find(c => c.id === activeChatId)
        return chat?.messages || []
    }, [activeChatId, chatHistory])

    // Handle chat selection
    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId)
        const chat = chatHistory.find(c => c.id === chatId)
        setCurrentMessages(chat?.messages || [])
    }

    // Handle new chat
    const handleNewChat = () => {
        setActiveChatId(null)
        setCurrentMessages([])
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

        // Add user message
        setCurrentMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Simulate bot response
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

            // Create new chat if needed
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
                // Update existing chat
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

    // Simple bot response generator
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
            {/* Exit Button */}
            <ChatExitButton />

            {/* Chat Container */}
            <div className="flex h-full w-full">
                <ChatSidebar
                    chatHistory={chatHistory}
                    activeChatId={activeChatId}
                    onChatSelect={handleChatSelect}
                    onNewChat={handleNewChat}
                />
                <ChatArea
                    messages={currentMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}