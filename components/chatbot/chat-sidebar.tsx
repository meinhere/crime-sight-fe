'use client'

import { ChatHistory } from '@/data/chat-data'
import { IconPlus, IconX } from '@tabler/icons-react'

interface ChatSidebarProps {
    chatHistory: ChatHistory[]
    activeChatId: string | null
    onChatSelect: (chatId: string) => void
    onNewChat: () => void
    isOpen: boolean
    onClose: () => void
}

export function ChatSidebar({
    chatHistory,
    activeChatId,
    onChatSelect,
    onNewChat,
    isOpen,
    onClose
}: ChatSidebarProps) {

    // Group chats by date
    const groupChatsByDate = (chats: ChatHistory[]) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        const groups: { [key: string]: ChatHistory[] } = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 days': [],
            'Older': []
        }

        chats.forEach(chat => {
            const chatDate = new Date(chat.timestamp.getFullYear(), chat.timestamp.getMonth(), chat.timestamp.getDate())

            if (chatDate.getTime() === today.getTime()) {
                groups['Today'].push(chat)
            } else if (chatDate.getTime() === yesterday.getTime()) {
                groups['Yesterday'].push(chat)
            } else if (chatDate >= weekAgo) {
                groups['Previous 7 days'].push(chat)
            } else {
                groups['Older'].push(chat)
            }
        })

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) {
                delete groups[key]
            }
        })

        return groups
    }

    const groupedChats = groupChatsByDate(chatHistory)

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return (
        <>
            {/* Mobile Backdrop with Blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-white/30 z-[9999] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                fixed lg:relative
                left-0 top-0
                w-80 sm:w-96 lg:w-80 xl:w-96
                h-full
                bg-gray-50
                border-r border-gray-200
                flex flex-col
                z-[10000] lg:z-auto
                transition-transform duration-300 ease-in-out
                flex-shrink-0
            `}>
                {/* Header with Close Button */}
                <div className="p-4 lg:p-4 border-b border-gray-200 flex-shrink-0 relative">
                    {/* Mobile Close Button - Positioned to not overlap */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
                    >
                        <IconX className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* New Chat Button */}
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <IconPlus className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        <span className="text-sm lg:text-base text-gray-700 font-medium">New Chat</span>
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 lg:p-4 space-y-4 lg:space-y-6">
                        {Object.keys(groupedChats).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">Belum ada riwayat chat</p>
                                <p className="text-xs mt-1">Mulai percakapan baru dengan tombol di atas</p>
                            </div>
                        ) : (
                            Object.entries(groupedChats).map(([groupName, chats]) => (
                                <div key={groupName}>
                                    {/* Group Header */}
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 lg:mb-3 px-1">
                                        {groupName}
                                    </h3>

                                    {/* Chats in Group */}
                                    <div className="space-y-1.5 lg:space-y-2">
                                        {chats.map((chat) => (
                                            <button
                                                key={chat.id}
                                                onClick={() => onChatSelect(chat.id)}
                                                className={`w-full text-left p-2.5 lg:p-3 rounded-lg lg:rounded-xl transition-colors ${activeChatId === chat.id
                                                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                        : 'hover:bg-white hover:border hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="font-medium text-gray-800 text-xs lg:text-sm mb-1 truncate">
                                                    {chat.title}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {chat.lastMessage}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {groupName === 'Today' ? formatTime(chat.timestamp) : formatDate(chat.timestamp)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}