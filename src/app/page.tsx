"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createConversationId } from "@/lib/create-conversation";
import { Button } from "@/components/ui/button";
import { Paperclip, Plus, Mic, ArrowUp } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    const id = createConversationId();

    router.push(`/conversations/${id}?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-white to-gray-100">
      
      {/* HERO TITLE */}
      <div className="text-center mb-10 mt-16">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight">
          Build something{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 via-emerald-400 to-emerald-900">
            Sprint Planner
          </span>
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Create by chatting with AI
        </p>
      </div>

      {/* INPUT BOX AREA */}
      <div className="w-full max-w-3xl p-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          
          {/* MULTILINE INPUT */}
          <textarea
            className="w-full bg-transparent resize-none outline-none text-gray-700 text-lg leading-relaxed placeholder:text-gray-400"
            rows={2}
            placeholder="Ask Lovable to create a landing page..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* ACTION BAR */}
          <div className="flex items-center justify-between mt-4">
            {/* LEFT BUTTONS */}
            <div className="flex items-center gap-3 text-gray-500">

              <button className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition">
                <Plus size={18} />
              </button>

              <button className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition">
                <Paperclip size={16} />
                Attach
              </button>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex items-center gap-3">
              <button className="p-2 cursor-pointer hover:bg-gray-100 rounded-full text-gray-600 transition">
                <Mic size={18} />
              </button>

              <Button
                onClick={handleSubmit}
                className="rounded-full cursor-pointer h-10 w-10 p-0 flex items-center justify-center bg-black text-white hover:bg-gray-800"
              >
                <ArrowUp size={20} />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
