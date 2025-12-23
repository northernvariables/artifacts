import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  id: number
  text: string
  isUser: boolean
  hasLink?: boolean
  linkUrl?: string
  linkText?: string
}

interface KnowledgeEntry {
  keywords: string[]
  response: string
  hasLink?: boolean
  linkUrl?: string
  linkText?: string
}

const nvKnowledge: KnowledgeEntry[] = [
  {
    keywords: ['about', 'what is', 'northern variables', 'who are you', 'what do you do'],
    response: 'Northern Variables is an independent Canadian political analysis platform. We explain how power, policy, and narrative work in Canada with evidence-based reporting.',
  },
  {
    keywords: ['topics', 'cover', 'write about', 'content', 'focus'],
    response: 'We cover Federal Politics & Elections, Economic Policy, Media Literacy, Democratic Institutions, and Global Influence Networks. Our long-form analysis is designed for durability beyond the daily news cycle.',
  },
  {
    keywords: ['subscribe', 'newsletter', 'updates', 'email'],
    response: 'You can subscribe to our free newsletter on Substack for weekly analysis delivered to your inbox!',
    hasLink: true,
    linkUrl: 'https://substack.northernvariables.ca/subscribe',
    linkText: 'Subscribe now',
  },
  {
    keywords: ['canadagpt', 'ai', 'chatbot', 'artificial intelligence', 'gpt', 'signup', 'sign up'],
    response: 'CanadaGPT is our AI-powered tool for exploring Canadian government data and political analysis. Sign up for free to ask questions about federal spending, MPs, legislation, and more!',
    hasLink: true,
    linkUrl: 'https://canadagpt.ca',
    linkText: 'Sign up for CanadaGPT',
  },
  {
    keywords: ['election', 'vote', 'polling', 'polls', 'parties', 'liberal', 'conservative', 'ndp'],
    response: 'We provide evidence-based election coverage and analysis. For interactive electoral data and AI-powered political analysis, sign up for CanadaGPT - it\'s free!',
    hasLink: true,
    linkUrl: 'https://canadagpt.ca',
    linkText: 'Sign up for CanadaGPT',
  },
  {
    keywords: ['trudeau', 'poilievre', 'singh', 'parliament', 'mp', 'government', 'policy', 'legislation'],
    response: 'For detailed, AI-powered analysis of Canadian politicians, parliamentary proceedings, and policy, sign up for CanadaGPT - it has access to comprehensive government data!',
    hasLink: true,
    linkUrl: 'https://canadagpt.ca',
    linkText: 'Sign up free',
  },
  {
    keywords: ['artifact', 'tool', 'interactive', 'visualization', 'data'],
    response: 'Check out our Artifacts page for interactive tools and data visualizations related to Canadian politics!',
    hasLink: true,
    linkUrl: '/artifacts',
    linkText: 'View Artifacts',
  },
  {
    keywords: ['contact', 'reach', 'email', 'message', 'feedback'],
    response: 'You can reach Northern Variables through our social media channels - we\'re active on X (Twitter), Facebook, and Threads!',
  },
  {
    keywords: ['founder', 'matthew', 'dufresne', 'who runs', 'who made'],
    response: 'Northern Variables was founded by Matthew Dufresne, who is committed to providing independent, evidence-based Canadian political analysis.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: 'Hello! I\'m here to help you learn about Northern Variables. For in-depth political questions, sign up for CanadaGPT - our AI-powered analysis tool!',
    hasLink: true,
    linkUrl: 'https://canadagpt.ca',
    linkText: 'Sign up for CanadaGPT',
  },
]

const fallbackResponses = [
  "That's a great question! For in-depth Canadian political analysis powered by AI, sign up for CanadaGPT - it's free!",
  "I can help with questions about Northern Variables. For detailed political queries, sign up for CanadaGPT to access comprehensive government data!",
  "For that kind of analysis, I'd recommend signing up for CanadaGPT - our AI tool that specializes in Canadian political data!",
]

function findResponse(input: string): KnowledgeEntry | null {
  const lowercaseInput = input.toLowerCase()

  for (const entry of nvKnowledge) {
    for (const keyword of entry.keywords) {
      if (lowercaseInput.includes(keyword.toLowerCase())) {
        return entry
      }
    }
  }

  return null
}

function getRandomFallback(): string {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
}

// CanadaGPT Maple Leaf SVG Component - exact match from CanadaGPT branding
function MapleLeaf({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="240 180 720 780" fill="currentColor">
      <path d="M927.04,566l-41.01-23.15,33.04-105.39c.88-2.8-1.52-5.54-4.32-4.93l-99.65,21.71-21.81-48.16c-1.14-2.52-4.44-2.99-6.2-.89l-63.28,75.38c-3.93,4.68-10.32,6.25-15.88,3.91h0c-6.09-2.56-9.62-9.15-8.47-15.82l31.46-182.16c.28-1.62-1.37-2.87-2.79-2.12l-56.47,29.83c-2.62,1.39-5.84.38-7.27-2.26l-62.73-115.82c-.74-1.36-2.65-1.36-3.39,0l-62.73,115.82c-1.43,2.65-4.65,3.65-7.27,2.26l-56.47-29.83c-1.43-.75-3.07.5-2.79,2.12l31.46,182.16c1.15,6.67-2.38,13.25-8.47,15.82h0c-5.56,2.34-11.95.76-15.88-3.91l-63.28-75.38c-1.77-2.11-5.06-1.64-6.2.89l-21.81,48.16-99.65-21.71c-2.8-.61-5.2,2.12-4.32,4.93l33.04,105.39-41.01,23.15c-2.3,1.3-2.61,4.57-.6,6.3l159.39,137.28c4.81,4.14,6.76,10.81,4.99,16.99l-14.48,50.34c-.66,2.28,1.28,4.46,3.55,3.99l140.33-29.03c4.16-.86,8.49-.32,12.33,1.55h0c7.28,3.55,11.73,11.29,11.23,19.55l-9.44,158.05h39.56l-9.44-158.05c-.49-8.27,3.95-16.01,11.23-19.55h0c3.84-1.87,8.16-2.41,12.33-1.55l140.33,29.03c2.27.47,4.2-1.71,3.55-3.99l-14.48-50.34c-1.78-6.18.18-12.86,4.99-16.99l159.39-137.28c2.01-1.73,1.7-5-.6-6.3Z"/>
    </svg>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Northern Variables! I can answer questions about our political analysis and coverage. For in-depth AI-powered questions about Canadian politics, sign up for CanadaGPT!",
      isUser: false,
      hasLink: true,
      linkUrl: 'https://canadagpt.ca',
      linkText: 'Sign up for CanadaGPT',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    const knowledgeMatch = findResponse(userMessage.text)

    const botMessage: Message = {
      id: Date.now() + 1,
      text: knowledgeMatch?.response || getRandomFallback(),
      isUser: false,
      hasLink: knowledgeMatch?.hasLink,
      linkUrl: knowledgeMatch?.linkUrl,
      linkText: knowledgeMatch?.linkText,
    }

    // If it's a fallback, add CanadaGPT signup link
    if (!knowledgeMatch) {
      botMessage.hasLink = true
      botMessage.linkUrl = 'https://canadagpt.ca'
      botMessage.linkText = 'Sign up for CanadaGPT'
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, botMessage])
  }

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 chat-button-pulse'
        }`}
        aria-label="Open chat"
        aria-expanded={isOpen}
      >
        <MapleLeaf className="w-7 h-7" />
      </button>

      {/* Chat Window - Bottom Right */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with Northern Variables"
      >
        {/* Header */}
        <div className="bg-[#0f2747] px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
              <MapleLeaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Northern Variables</h3>
              <p className="text-white/60 text-xs">Ask us anything</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50" role="log" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.isUser
                    ? 'bg-[#ff6719] text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.hasLink && message.linkUrl && (
                  <a
                    href={message.linkUrl}
                    target={message.linkUrl.startsWith('http') ? '_blank' : undefined}
                    rel={message.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center gap-1.5 mt-2 text-sm font-semibold ${
                      message.isUser
                        ? 'text-white/90 hover:text-white'
                        : 'text-[#0f2747] hover:text-[#ff6719]'
                    } transition-colors`}
                  >
                    {message.linkText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2747]/20 transition-shadow"
              disabled={isTyping}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#0f2747] text-white flex items-center justify-center hover:bg-[#163b6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* CanadaGPT Signup Promotion */}
          <a
            href="https://canadagpt.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-3 py-2.5 px-4 bg-red-50 hover:bg-red-100 rounded-full text-xs transition-colors"
          >
            <MapleLeaf className="w-4 h-4 text-red-600" />
            <span className="text-gray-600">Want AI-powered analysis?</span>
            <span className="font-semibold text-red-600">Sign up for CanadaGPT</span>
          </a>
        </form>
      </div>
    </>
  )
}
