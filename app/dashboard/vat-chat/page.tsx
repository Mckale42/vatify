"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export default function VatChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: "Welcome to VAT Chat! Ask me anything about VAT claims, regulations, or how to maximize your refunds.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/vat-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get a response")
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
      // Focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold mb-8">VAT Chat Assistant</h1>

      <Card className="h-[calc(100%-5rem)]">
        <CardHeader>
          <CardTitle>Ask about VAT</CardTitle>
          <CardDescription>Get instant answers about VAT regulations, claims, and best practices</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)]">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } ${message.role === "system" ? "justify-center" : ""}`}
                >
                  {message.role === "system" ? (
                    <div className="bg-blue-50 text-blue-800 rounded-lg p-4 max-w-[80%] text-center">
                      <p>{message.content}</p>
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={message.role === "assistant" ? "bg-primary text-white" : "bg-gray-200"}>
                        <AvatarFallback>
                          {message.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "assistant"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="mb-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div
                          className={`text-xs ${
                            message.role === "assistant" ? "text-gray-500" : "text-primary-foreground/70"
                          } text-right mt-1`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-primary text-white">
                      <AvatarFallback>
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Type your VAT question here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 border-accent/30 focus-visible:ring-primary"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
