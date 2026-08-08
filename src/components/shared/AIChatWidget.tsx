'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Halo! Saya adalah Kartavia AI Assistant. Ada yang bisa saya bantu untuk merencanakan liburan Anda di Yogyakarta?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = input.trim()
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages as any)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.reply || 'API Error')
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: error.message || 'Maaf, saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-110 hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/50"
          aria-label="Open AI Chat"
        >
          <MessageSquare className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <span className="font-semibold">Kartavia AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end ml-auto' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-brand-500 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm prose prose-sm max-w-none dark:prose-invert'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed text-sm" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-slate-900 p-3 border-t border-gray-100 dark:border-slate-800">
            <form onSubmit={handleSend} className="flex items-center gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 pr-12 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="absolute right-1 top-1 bottom-1 flex aspect-square items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
