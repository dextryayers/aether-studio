import { PageLayout } from "@/src/components/layout/PageLayout"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Send, Sparkles, MessageSquare, Bot, User, Zap, Lightbulb, ArrowUpRight, Rocket } from "lucide-react"
import { createChat } from "@/src/services/geminiService"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/context/LanguageContext"

interface Message {
  role: "user" | "model"
  content: string
}

export default function ChatPage() {
  const { t } = useLanguage()
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

  useEffect(() => {
    const init = async () => {
      const newChat = await createChat()
      setChat(newChat)
    }
    init()
  }, [])

  const handleSend = async () => {
    if (!message.trim() || isLoading || !chat) return

    const userMessage: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.content })
      
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
      setMessages((prev) => [...prev, { role: "model", content: `${t("chat.error")} (Tech: ${errorMsg})` }])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = t("chat.suggestions") as unknown as string[]

  return (
    <PageLayout>
      <div className="page-fade-in flex flex-col h-[calc(100vh-4rem)] lg:h-screen relative overflow-hidden">
        {/* Header Section */}
        <section className="px-4 py-6 md:px-6 md:py-8 border-b bg-background/50 backdrop-blur-md relative z-10 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <Rocket className="h-6 w-6 md:h-8 md:w-8 text-primary fill-primary" />
                Aether <span className="text-primary italic">AI</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mt-1 opacity-60">
                {t("chat.neural")}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-500">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               {t("chat.active")}
            </div>
          </div>
        </section>

        {/* Chat Interface */}
        <div className="flex-grow overflow-hidden flex flex-col relative">
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth"
          >
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-12">
              {messages.length === 0 && (
                <div className="py-12 md:py-20 text-center space-y-8 md:space-y-12">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150" />
                    <Bot className="h-14 w-14 md:h-20 md:w-20 text-primary relative z-10 mx-auto opacity-80" />
                  </div>
                  
                  <div className="space-y-4 px-4">
                    <h2 className="text-3xl md:text-6xl display-bold uppercase leading-tight">{t("chat.unleash")} <br /><span className="text-primary italic">{t("chat.pulse")}</span></h2>
                    <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto font-medium opacity-80">
                      {t("chat.description")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestions.map((text) => (
                      <button
                        key={text}
                        onClick={() => setMessage(text)}
                        className="p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left text-xs font-bold tracking-tight group flex items-center justify-between"
                      >
                        {text}
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={cn(
                    "flex gap-4 md:gap-6 items-start",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 border",
                    msg.role === "user" ? "bg-primary border-primary/20 text-white" : "bg-muted border-border"
                  )}>
                    {msg.role === "user" ? <User className="h-4 w-4 md:h-5 md:w-5" /> : <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] md:max-w-[80%] space-y-2",
                    msg.role === "user" ? "text-right" : "text-left"
                  )}>
                    <div className={cn(
                      "p-4 md:p-5 rounded-2xl md:rounded-3xl pb-5 md:pb-6 leading-relaxed font-medium max-w-none text-xs md:text-base",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10" 
                        : "bg-muted/30 dark:bg-muted/10 border border-border text-foreground rounded-tl-none shadow-sm"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="bg-muted/30 dark:bg-muted/10 border border-border p-5 rounded-3xl rounded-tl-none flex gap-2">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 pt-0 bg-transparent relative z-20">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-3xl scale-95 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-background border-2 border-border focus-within:border-primary p-1.5 md:p-2 rounded-[2rem] flex items-center gap-2 md:gap-3 transition-all duration-300">
                <div className="pl-3 md:pl-4">
                  <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("chat.placeholder")}
                  className="border-none focus-visible:ring-0 text-sm md:text-base h-10 md:h-12 bg-transparent"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-2xl shrink-0 group/send"
                >
                  <Send className={cn(
                    "h-4 w-4 md:h-5 md:w-5 transition-transform group-hover/send:-rotate-12",
                    isLoading && "animate-pulse"
                  )} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
