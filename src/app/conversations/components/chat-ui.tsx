"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { sender: "bot", content: "Hi! Ask me anything 😊" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", content: userMessage }]);
    setIsStreaming(true);

    // Create placeholder bot message
    const botIndex =
      messages.length + 1; // points to where bot message will be added

    setMessages((prev) => [...prev, { sender: "bot", content: "" }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userMessage }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      // python returns chunks like: {"content":"hello"}
      try {
        const json = JSON.parse(chunk);
        setMessages((prev) => {
          const updated = [...prev];
          updated[botIndex].content += json.content;
          return updated;
        });
      } catch (err) {
        console.log("Non-JSON chunk ignored:", err);
      }
    }

    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.sender === "user"
                ? "bg-primary text-white self-end ml-auto"
                : "bg-muted"
            }`}
          >
            {msg.content || (isStreaming && msg.sender === "bot" ? "..." : "")}
          </div>
        ))}

        <div ref={messageEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
