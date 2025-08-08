"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minus, Square, Send } from 'lucide-react'
import { BaseButton } from "@/components/ui/base-button"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/store/hooks"
import { io, Socket } from "socket.io-client"
import { getGravatarUrl } from "@/utils/gravatar"
import { useCurrentUser } from "@/api/hooks/useCurrentUser";
import { playSound } from "@/utils/play-sound"

interface ChatMessage {
  id: string
  content: string
  isBot: boolean
  created_at: Date
  users?: {
    id: string
    name: string
    email: string
    avatar?: string
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
  }, [messages])

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
            id: msg.id,
            content: msg.content,
            isBot: !!isBot,
            created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
            user: msg.user
          }
        })

        setMessages(formattedMessages)
      })

      socket.on('new_message', (message: any) => {
        console.log("message.user", message.users)
        const isBot = message.users?.email?.includes('admin') || message.users?.email?.includes('support');

        const formattedMessage: ChatMessage = {
          id: message.id,
          content: message.content,
          isBot: !!isBot,
          created_at: message.created_at ? new Date(message.created_at) : new Date(),
          users: message.users ?? null,
        }

        setMessages(prev => [...prev, formattedMessage])

        if (message.users?.email !== sessionState?.value?.email) {
          playSound('/sounds/receive.wav')
        }
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
        socket.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [isLoggedIn, userToken, isOpen, sessionState?.value?.email])

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
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-foreground text-xs font-bold">A</span>
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
                        <img
                          src={getGravatarUrl(message.users?.email)}
                          alt={message.users?.name || "User"}
                          title={message.users?.email} // 👈 show email when hover
                          className="w-8 h-8 rounded-full"
                        />
                        {!message.users ? (
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-base text-gray-500 italic">[System message]</p>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-base text-[#0066FF]">User Email: {message.users?.email} Admin</p>
                            <p className="text-base text-[#538E76]">User Name: {message.users?.name}</p>
                            <p className="text-base mt-1">{message.content}</p>
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
                        <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-3 max-w-xs ml-auto">
                          <p className="text-base text-[#0066FF]">User Email: {message.users?.email} Not Admin</p>
                          <p className="text-base text-[#538E76]">User Name: {message.users?.name}</p>
                          <p className="text-base mt-1">{message.content}</p>
                          <p className="text-xs text-gray-300 dark:text-black mt-1">
                            {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <img
                          src={getGravatarUrl(message.users?.email)}
                          title={message.users?.email} // 👈 show email when hover
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
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-foreground text-xs font-bold">A</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-base text-gray-500">Typing...</p>
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
