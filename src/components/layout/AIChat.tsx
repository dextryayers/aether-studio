import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Send, Sparkles, X, MessageSquare, Bot } from "lucide-react"
import { createChat } from "@/src/services/geminiService"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { cn } from "@/src/lib/utils"

interface Message {
  role: "user" | "model"
  content: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [chat, setChat] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const initializeChat = async () => {
    try {
      const newChat = await createChat()
      setChat(newChat)
    } catch (error) {
      console.error("Failed to initialize chat:", error)
    }
  }

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    let currentChat = chat
    if (!currentChat) {
      const newChat = await createChat()
      setChat(newChat)
      currentChat = newChat
    }

    const userMessage: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const stream = await currentChat.sendMessageStream({ message: userMessage.content })
      
      let incomingContent = ""
      setMessages((prev) => [...prev, { role: "model", content: "" }])

      for await (const chunk of stream) {
        if (chunk.text) {
          incomingContent += chunk.text
          setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = incomingContent
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      setMessages((prev) => [...prev, { role: "model", content: `Apologies, my synaptic link was momentarily interrupted: ${errorMsg}. Please try asking again.` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full"
          >
            <Button 
              onClick={() => {
                setIsOpen(true)
                if (!chat) initializeChat()
              }}
              variant="outline" 
              className="w-full h-14 bg-muted/30 border-dashed border-primary/30 text-xs font-black uppercase tracking-widest gap-2 hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
              Ask Aether AI
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-card border border-primary/20 rounded-2xl overflow-hidden flex flex-col shadow-xl"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aether Assistant</span>
              </div>
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div 
              ref={scrollRef}
              className="h-[300px] overflow-y-auto p-4 space-y-4 scrollbar-hide text-[13px] leading-relaxed"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground text-[11px] font-medium leading-relaxed italic">
                    "I am the synaptic pulse of Aether. Ask me about our vision, branding, or the digital future."
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "max-w-[85%] p-3 rounded-2xl font-medium",
                    msg.role === "user" 
                      ? "bg-primary text-white ml-auto rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none border border-border/50"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-none border border-border/50 w-24 flex gap-1 items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-150" />
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border flex gap-2 items-center bg-card">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="h-10 text-xs bg-muted/50 border-none rounded-xl"
              />
              <Button 
                onClick={handleSend}
                size="icon" 
                className={cn(
                  "h-10 w-10 shrink-0 rounded-xl transition-all duration-300",
                  message.trim() ? "bg-primary opacity-100" : "bg-muted text-muted-foreground opacity-50"
                )}
                disabled={!message.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
