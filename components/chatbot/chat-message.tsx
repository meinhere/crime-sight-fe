import { ChatMessage } from '@/data/chat-data'

interface ChatMessageProps {
    message: ChatMessage
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
    const isUser = message.sender === 'user'

    return (
        <div className={`flex gap-2 lg:gap-3 mb-4 lg:mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                {isUser ? (
                    <span className="text-white text-xs lg:text-sm font-medium">U</span>
                ) : (
                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-full"></div>
                )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                <div
                    className={`inline-block px-3 py-2 lg:px-4 lg:py-3 rounded-2xl ${isUser
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                >
                    <p className="text-xs lg:text-sm leading-relaxed break-words">{message.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-1 lg:px-2">
                    {message.timestamp.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    )
}