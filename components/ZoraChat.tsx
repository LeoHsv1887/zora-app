"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_REPLIES = [
  "Welche Förderung für Wärmepumpe?",
  "Bin ich als Mieter förderberechtigt?",
  "Was ist der Unterschied BEG und BAFA?",
];

function nowTime() {
  return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hallo! Ich bin Zora, dein KI-Assistent für Fördermittel. Ich beantworte alle deine Fragen rund um Förderungen — kostenlos und sofort. Was möchtest du wissen?",
  timestamp: nowTime(),
};

export function ZoraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from sessionStorage once on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("zora-chat");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Persist to sessionStorage (only after initial load)
  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem("zora-chat", JSON.stringify(messages));
    } catch {}
  }, [messages, loaded]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Unread badge when new assistant message arrives and chat is closed
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && messages.length > 1 && !isOpen) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = { role: "user", content: text.trim(), timestamp: nowTime() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setIsLoading(true);

      try {
        const apiMessages = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: nowTime() }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.", timestamp: nowTime() },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-[96px] right-6 z-[9998] flex flex-col bg-white rounded-2xl overflow-hidden"
            style={{
              width: "380px",
              maxWidth: "calc(100vw - 32px)",
              height: "520px",
              maxHeight: "70vh",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div className="bg-[#1D9E75] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Zora</p>
                  <p className="text-[10px] text-white/80 font-medium">Fördermittel-Assistent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
                  Online · Antwortet sofort
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Chat schließen"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9fafb]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1D9E75] text-white rounded-tr-sm"
                        : "bg-white text-[#1a1a1a] border border-[#e5e7eb] rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#9ca3af] mt-1 px-1">{msg.timestamp}</span>

                  {/* Quick replies after welcome (only if no further messages yet) */}
                  {i === 0 && msg.role === "assistant" && messages.length === 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                      {QUICK_REPLIES.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-xs font-medium text-[#1D9E75] bg-[#E1F5EE] border border-[#1D9E75]/20 hover:bg-[#1D9E75] hover:text-white transition-colors px-3 py-1.5 rounded-full"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white border border-[#e5e7eb] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full bg-[#9ca3af] block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 bg-white border-t border-[#e5e7eb] px-3 py-3 flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Schreib eine Frage..."
                rows={1}
                className="flex-1 resize-none text-sm text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none leading-relaxed bg-transparent"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-[#1D9E75] hover:bg-[#0F6E56] disabled:bg-[#e5e7eb] disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                aria-label="Nachricht senden"
              >
                <ArrowUp size={16} className={input.trim() && !isLoading ? "text-white" : "text-[#9ca3af]"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ──────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#1D9E75] flex items-center justify-center"
        style={{ boxShadow: "0 4px 20px rgba(29,158,117,0.4)" }}
        aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageCircle size={22} className="text-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
