"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageComposerProps {
  onSend: (body: string, tags?: string) => Promise<void>;
}

const quickReplies = [
  "Clarify Market Size",
  "Share Roadmap",
  "Explain Business Model",
];

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-3 sm:p-4 space-y-2 sm:space-y-3 shrink-0">
      {/* Helper text */}
      <p className="text-xs text-muted-foreground hidden sm:block">
        Investors prefer concise answers backed by reasoning. Highlight clear
        metrics when possible.
      </p>

      {/* Quick reply chips */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            className="text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/60 bg-background hover:bg-accent transition-colors shrink-0 whitespace-nowrap"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply clearly. Give specific, actionable answers."
          className="min-h-[80px] sm:min-h-[100px] resize-none rounded-xl text-sm"
          disabled={isSending}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="shrink-0 h-[80px] sm:h-[100px] rounded-xl"
          size="icon"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
