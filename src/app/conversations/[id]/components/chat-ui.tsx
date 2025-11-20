/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  JSX,
} from "react";

// Utility for stable IDs
const uid = () => crypto.randomUUID();

// Type with static InputBar
type ChatUIType = React.ForwardRefExoticComponent<
  {} & React.RefAttributes<any>
> & {
  InputBar: (props: { onSend: (msg: string) => void }) => JSX.Element;
};

const ChatUI = forwardRef(function ChatUIComponent(_props, ref) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Expose send method to parent
  useImperativeHandle(ref, () => ({
    handleSend,
  }));

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // 1. Add user message
    const userMsg = {
      id: uid(),
      sender: "user",
      content: message,
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Add bot placeholder with stable ID
    const botId = uid();
    setMessages(prev => [...prev, { id: botId, sender: "bot", content: "" }]);

    setIsStreaming(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.body) {
      console.error("No stream body returned");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Expect NDJSON lines
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (!line) continue;

        try {
          const json = JSON.parse(line);

          if (json.content) {
            // Append only NEW token
            setMessages(prev =>
              prev.map(m =>
                m.id === botId
                  ? { ...m, content: m.content + json.content }
                  : m
              )
            );
          }
        } catch (e) {
          console.error("JSON parse error:", line,e);
        }
      }
    }

    setIsStreaming(false);
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="text-gray-500 text-center py-10">
          Start a conversation ✨
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 max-w-[70%] rounded-2xl text-sm shadow ${
              msg.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            {msg.content || (isStreaming && msg.sender === "bot" ? "…" : "")}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}) as ChatUIType;

// InputBar
ChatUI.InputBar = function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full p-2 shadow-md">
      <input
        className="flex-1 outline-none px-3 py-2 bg-transparent text-gray-700 placeholder:text-gray-400"
        placeholder="Type your message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      <button
        onClick={submit}
        className="h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatUI;
