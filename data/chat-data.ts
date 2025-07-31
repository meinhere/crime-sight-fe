export interface ChatMessage {
    id: string
    content: string
    sender: 'user' | 'bot'
    timestamp: Date
    chatId: string
}

export interface ChatHistory {
    id: string
    title: string
    lastMessage: string
    timestamp: Date
    messages: ChatMessage[]
}

export const chatHistoryData: ChatHistory[] = [
    // Today
    {
        id: 'chat-1',
        title: 'Pembahasan Dasar HTML5',
        lastMessage: 'HTML5 adalah versi terbaru dari HTML yang memiliki...',
        timestamp: new Date(),
        messages: [
            {
                id: 'msg-1',
                content: 'Apa itu HTML5?',
                sender: 'user',
                timestamp: new Date(),
                chatId: 'chat-1'
            },
            {
                id: 'msg-2',
                content: 'HTML5 adalah versi terbaru dari HTML yang memiliki fitur-fitur modern untuk pengembangan web.',
                sender: 'bot',
                timestamp: new Date(),
                chatId: 'chat-1'
            }
        ]
    },
    {
        id: 'chat-2',
        title: 'Hukum Pidana Indonesia',
        lastMessage: 'Hukum pidana mengatur tentang perbuatan yang dilarang...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        messages: [
            {
                id: 'msg-3',
                content: 'Jelaskan tentang hukum pidana Indonesia',
                sender: 'user',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                chatId: 'chat-2'
            },
            {
                id: 'msg-4',
                content: 'Hukum pidana mengatur tentang perbuatan yang dilarang dan sanksi yang diberikan.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                chatId: 'chat-2'
            }
        ]
    },

    // Yesterday
    {
        id: 'chat-3',
        title: 'Redesign Welcome Header',
        lastMessage: 'Untuk redesign header, perlu mempertimbangkan UX...',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        messages: [
            {
                id: 'msg-5',
                content: 'Bagaimana cara redesign welcome header?',
                sender: 'user',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                chatId: 'chat-3'
            },
            {
                id: 'msg-6',
                content: 'Untuk redesign header, perlu mempertimbangkan UX yang baik dan responsive design.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                chatId: 'chat-3'
            }
        ]
    },
    {
        id: 'chat-4',
        title: 'Solusi Sistem Kenaikan Pangkat',
        lastMessage: 'Sistem kenaikan pangkat bisa menggunakan algoritma...',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-7',
                content: 'Bagaimana membuat sistem kenaikan pangkat yang efektif?',
                sender: 'user',
                timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
                chatId: 'chat-4'
            },
            {
                id: 'msg-8',
                content: 'Sistem kenaikan pangkat bisa menggunakan algoritma penilaian berdasarkan kinerja dan masa kerja.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
                chatId: 'chat-4'
            }
        ]
    },

    // 2 days ago
    {
        id: 'chat-5',
        title: 'Error Render Data Laravel',
        lastMessage: 'Error render biasanya terjadi karena masalah query...',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-9',
                content: 'Kenapa data Laravel tidak bisa di-render?',
                sender: 'user',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                chatId: 'chat-5'
            },
            {
                id: 'msg-10',
                content: 'Error render biasanya terjadi karena masalah query database atau struktur data yang tidak sesuai.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                chatId: 'chat-5'
            }
        ]
    },
    {
        id: 'chat-6',
        title: 'Implementasi JWT Authentication',
        lastMessage: 'JWT adalah standar untuk token authentication...',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-11',
                content: 'Bagaimana cara implementasi JWT di aplikasi?',
                sender: 'user',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
                chatId: 'chat-6'
            },
            {
                id: 'msg-12',
                content: 'JWT adalah standar untuk token authentication yang aman dan stateless.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
                chatId: 'chat-6'
            }
        ]
    },

    // 3 days ago
    {
        id: 'chat-7',
        title: 'Database Optimization MySQL',
        lastMessage: 'Optimasi database bisa dilakukan dengan indexing...',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-13',
                content: 'Tips optimasi database MySQL?',
                sender: 'user',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                chatId: 'chat-7'
            },
            {
                id: 'msg-14',
                content: 'Optimasi database bisa dilakukan dengan indexing, query optimization, dan proper schema design.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                chatId: 'chat-7'
            }
        ]
    },
    {
        id: 'chat-8',
        title: 'React Hook useEffect',
        lastMessage: 'useEffect digunakan untuk side effects dalam React...',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-15',
                content: 'Kapan menggunakan useEffect di React?',
                sender: 'user',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
                chatId: 'chat-8'
            },
            {
                id: 'msg-16',
                content: 'useEffect digunakan untuk side effects dalam React seperti API calls, subscriptions, atau DOM manipulation.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
                chatId: 'chat-8'
            }
        ]
    },

    // 1 week ago
    {
        id: 'chat-9',
        title: 'API Design Best Practices',
        lastMessage: 'RESTful API harus mengikuti standar HTTP methods...',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-17',
                content: 'Apa saja best practices untuk API design?',
                sender: 'user',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                chatId: 'chat-9'
            },
            {
                id: 'msg-18',
                content: 'RESTful API harus mengikuti standar HTTP methods, proper status codes, dan consistent naming convention.',
                sender: 'bot',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                chatId: 'chat-9'
            }
        ]
    },
    {
        id: 'chat-10',
        title: 'CSS Grid vs Flexbox',
        lastMessage: 'Grid untuk layout 2D, Flexbox untuk 1D...',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
        messages: [
            {
                id: 'msg-19',
                content: 'Kapan menggunakan CSS Grid dan kapan Flexbox?',
                sender: 'user',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
                chatId: 'chat-10'
            },
            {
                id: 'msg-20',
                content: 'Grid untuk layout 2D (baris dan kolom), Flexbox untuk 1D (satu arah).',
                sender: 'bot',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
                chatId: 'chat-10'
            }
        ]
    }
]

