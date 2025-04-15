"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { ChatWidget } from "./chat-widget"

export function ChatBotFloat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-[360px] h-[480px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Assistente Virtual</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChatWidget />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
