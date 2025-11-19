/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ChatUI from "./chat-ui";
import { useEffect, useRef } from "react";

export default function ChatPanel({ initialPrompt }: any) {
  const chatRef = useRef<any>(null);
  const sentInitialRef = useRef(false);

  useEffect(() => {
    if (!sentInitialRef.current && initialPrompt && chatRef.current) {
      sentInitialRef.current = true;       // 🔥 ensures it runs ONCE only
      chatRef.current.handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6">
        <ChatUI ref={chatRef} />
      </div>

      <div className="border-t bg-white p-4">
        <ChatUI.InputBar
          onSend={(msg: string) => chatRef.current?.handleSend(msg)}
        />
      </div>
    </div>
  );
}
