"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Message = {
  role: "user" | "bot"
  text: string
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      })
      const data = await res.json()
      const botMessage: Message = { role: "bot", text: data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: Message = { role: "bot", text: "Erro ao obter resposta." }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <ScrollArea className="flex-1 px-4 py-2 space-y-2 overflow-y-auto max-h-[360px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded-lg max-w-[80%] whitespace-pre-line ${
              msg.role === "user"
                ? "bg-blue-100 self-end text-right ml-auto"
                : "bg-gray-100 self-start text-left mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>Digitando</span>
            <span className="animate-bounce [animation-delay:-0.3s]">.</span>
            <span className="animate-bounce [animation-delay:-0.15s]">.</span>
            <span className="animate-bounce">.</span>
          </div>
        )}
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
        className="p-2 border-t flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          Enviar
        </Button>
      </form>
    </div>
  )
}
