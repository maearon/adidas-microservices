"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minus, Square, Send } from 'lucide-react'
import { BaseButton } from "@/components/ui/base-button"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/store/hooks"
import { io, Socket } from "socket.io-client"
import { getUiAvatarUrl } from "@/utils/ui-avatar"
import { useCurrentUser } from "@/api/hooks/useCurrentUser";
import { playSound } from "@/utils/play-sound"

interface ChatMessage {
  content: string
  isBot: boolean
  created_at: Date
  id: string
  room_id: string
  type: string
  updated_at: Date
  user_id: string
  users?: {
    email: string
    id: string
    name: string
    // avatar?: string
  }
}

export default function ChatWidget() {
  const { data: userData, status } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const repliedMessages = useRef<Set<string>>(new Set());

  // Get user data from Redux
  const sessionState = useAppSelector((state) => state.session)
  const isLoggedIn = sessionState?.loggedIn || false
  const userName = sessionState?.value?.name || "Guest"
  const userLevel = sessionState?.value?.level || "LEVEL 1"
  const userToken = sessionState?.value?.token // Assuming you have JWT token in session

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isMinimized, isOpen])

  // Initialize socket connection
  useEffect(() => {
    if (isLoggedIn && userToken && isOpen && status === "success") {
      // Base URL config
      const CHAT_SERVICE_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:3002"
        : "https://adidas-chat-service.onrender.com"
      // Replace with your deployed chat service URL
      // const CHAT_SERVICE_URL = "https://your-chat-service.onrender.com"

      socketRef.current = io(CHAT_SERVICE_URL, {
        query: { token: userToken },
        transports: ['websocket', 'polling']
      })

      const socket = socketRef.current

      // Connection events
      socket.on('connect', () => {
        console.log('✅ Connected to chat service')
        setIsConnected(true)
        // Join general room
        socket.emit('join_room', { roomId: 'general' })
      })

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from chat service')
        setIsConnected(false)
      })

      // Message events
      socket.on('message_history', (data: { messages: any[] }) => {
        console.log("messages", data.messages)
        const formattedMessages = data.messages.map((msg: any) => {
          const isBot = msg.users?.email?.includes('admin') || msg.users?.email?.includes('support');

          return {
            content: msg.content,
            isBot: !!isBot,
            created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
            id: msg.id,
            room_id: msg.room_id,
            type: msg.type,
            updated_at: msg.updated_at ? new Date(msg.updated_at) : new Date(),
            user_id: msg.user_id,
            users: msg.users ?? null,
          }
        })

        setMessages(formattedMessages)
      })

      // Khi nhận tin nhắn mới
      socket.on('new_message', async (msg: any) => {
        console.log("message.user", msg.users)
        const isBot =
          // repliedMessages.current.has(msg.content.slice(0, 150)) ||
          msg.users?.email?.includes('admin') ||
          msg.users?.email?.includes('support');

        const formattedMessage: ChatMessage = {
          content: msg.content,
          isBot: !!isBot,
          created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
          id: msg.id,
          room_id: msg.room_id,
          type: msg.type,
          updated_at: msg.updated_at ? new Date(msg.updated_at) : new Date(),
          user_id: msg.user_id,
          users: msg.users ?? {
            email: userData.email,
            name: userData.name,
            id: msg.user_id ?? null,
          },
        }

        setMessages(prev => [...prev, formattedMessage])

        if (msg.users?.email !== userData?.email) {
          playSound('/sounds/receive.wav')
        }

        // 🚀 Auto-reply logic nếu không phải admin và chưa trả lời Gọi AI reply
        // if (!isBot) {
          // try {
            // const botReply = await fetch("/api/ai-reply", {
              // method: "POST",
              // headers: { "Content-Type": "application/json" },
              // body: JSON.stringify({ message: msg.content })
// }).then(res => res.json());

            // ✅ Đánh dấu là gemini đã trả lời trước khi emit
            // repliedMessages.current.add(botReply.text.slice(0, 150));

            // socket.emit('message', {
              // roomId: 'general',
              // content: botReply.text.slice(0, 150), // Giới hạn hiện 50 ký tự
              // type: 'text'
            // });
          // } catch (err) {
            // console.error("Bot reply error:", err);
          //}
        // }
      })


      socket.on('user_typing', (data: { userEmail: string; isTyping: boolean }) => {
        if (data.userEmail !== sessionState?.value?.email) {
          setIsTyping(data.isTyping)
        }
      })

      socket.on('error', (error: { message: string }) => {
        console.error('Chat error:', error.message)
      })

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message_history');
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('error');

        socket.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [isLoggedIn, userToken, isOpen, sessionState?.value?.email])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     repliedMessages.current.clear();
  //   }, 60000); // 1 phút
  //   return () => clearInterval(interval);
  // }, []);

  // Don't show chat widget if user is not logged in
  if (!isLoggedIn) {
    return null
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim() || !socketRef.current || !isConnected) {
      return
    }

    socketRef.current.emit('message', {
      roomId: 'general',
      content: inputMessage.trim(),
      type: 'text'
    })

    setInputMessage("")
    playSound('/sounds/send.wav')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    
    // Send typing indicator
    if (socketRef.current) {
      socketRef.current.emit('typing', {
        roomId: 'general',
        isTyping: e.target.value.length > 0
      })
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev)
  }

  const emojiMap: Record<string, string> = {
  "<3": "❤️",
  ":)": "😊",
  ":(": "🙁",
  ":P": "👍",
  ":D": "😄",
  ":F": "😛",
  }

// Regex patterns để chỉ match 1 ký tự cười/buồn, không match nhiều
const patterns: Record<string, RegExp> = {
  ":)": /:\)(?!\))/g,     // match ":)" nhưng không match :))
  ":(": /:\((?!\()/g,     // match ":(" nhưng không match :((
  ":P": /:P(?!P)/g,        // match ":P" nhưng không match :PP
  ":D": /:D(?!D)/g,        // match ":D" nhưng không match :DD
  "<3": /<3(?!3)/g,         // match "<3" nhưng không match <33
  ":F": /:F(?!F)/g,
};

// Hàm thay thế emoji
function replaceEmojis(text: string): string {
  for (const [symbol, pattern] of Object.entries(patterns)) {
    text = text.replace(pattern, emojiMap[symbol]);
  }
  return text;
}

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition z-99"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
            fixed z-99 bg-white dark:bg-black text-foreground border border-gray-200 shadow-xl transition-all duration-300
            ${isMinimized
              // ? "w-96 h-16 sm:w-96 sm:h-16 bottom-6 right-6" 
              // iPhone 15 Pro Max: w-96 = 384px → Exceeds 375px → Overflows off the left screen if you use right-6.
              ? "w-80 h-16 sm:w-96 sm:h-16 bottom-6 right-6" 
              : "w-screen h-screen bottom-0 right-0 sm:w-96 sm:h-96 sm:bottom-6 sm:right-6"
            }
          `}
        >
          {/* Chat Header */}
          <div className="bg-background border-b border-gray-200 p-4 flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-black text-xs font-bold">A</span>
              </div>
              <div className="truncate">
                <h3 className="font-bold text-base leading-none truncate">CHAT</h3>
                <p className="text-xs text-gray-500 truncate">
                  adiclub {userLevel} • {isConnected ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="p-1 hover:bg-gray-100 rounded">
                {isMinimized ? <Square className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-4rem)] sm:h-[calc(24rem-4rem)]">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`${message.isBot ? "text-left" : "text-right"}`}>
                    {message.isBot ? (
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                          <span className="text-white dark:text-black text-xs font-bold">A</span>
                        </div>
                        {!message.users ? (
                          <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-3 max-w-xs">
                            <p className="text-base text-gray-500 italic">[System message]</p>
                            <p className="text-base text-[#0066FF]">User Email: [System message] Admin</p>
                            <p className="text-base text-[#538E76]">User Name: [System message]</p>
                            <p className="text-base mt-1">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-[#5B34FB] rounded-lg p-3 max-w-xs">
                            <p className="text-base text-white">{replaceEmojis(message.content)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // <div className="bg-black text-white rounded-lg p-3 max-w-xs ml-auto">
                      //   <p className="text-base">{message.content}</p>
                      //   <p className="text-xs text-gray-300 mt-1">
                      //     {message.timestamp.toLocaleTimeString()}
                      //   </p>
                      // </div>
                      <div className="flex items-end justify-end space-x-2">
                        <div className="bg-[#4C4C4C] rounded-lg p-3 max-w-xs ml-auto">
                          <p className="text-base text-white">{replaceEmojis(message.content)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <img
                          src={getUiAvatarUrl(message.users?.name)}
                          title={message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          alt={message.users?.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                      <span className="text-white dark:text-black text-xs font-bold">A</span>
                    </div>
                    <div className="bg-black dark:bg-white rounded-lg p-3">
                      <p className="text-base text-white dark:text-black">Typing....</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1"
                  />
                  <BaseButton
                    type="submit"
                    disabled={!inputMessage.trim() || !isConnected}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </BaseButton>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
