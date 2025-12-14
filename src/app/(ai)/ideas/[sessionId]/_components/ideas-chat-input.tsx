"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Lightbulb, MessageCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

interface IdeasChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function IdeasChatInput({
  onSend,
  isLoading = false,
  placeholder = "Describe your idea or ask a question…",
}: IdeasChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    const lineHeight = 22;
    const maxLines = 5;
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      lineHeight * maxLines
    )}px`;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      adjustTextareaHeight(textarea);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setValue("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        // Refocus after sending
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }
  };

  useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value]);

  // Auto-focus textarea on mount
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Small delay to ensure the component is fully rendered
      const timeoutId = setTimeout(() => {
        textarea.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Refocus when loading completes
  useEffect(() => {
    if (!isLoading) {
      const textarea = textareaRef.current;
      if (textarea) {
        const timeoutId = setTimeout(() => {
          textarea.focus();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isLoading]);

  const disabled = !value.trim() || isLoading;

  const handleQuickAction = (message: string) => {
    setValue(message);
    // Focus and adjust height after state update
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        adjustTextareaHeight(textarea);
      }
    }, 0);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6  backdrop-blur-md border-t border-slate-200/50">
      {/* Suggested Messages Quick Actions Buttons */}
      {!value.trim() && (
        <div className="mx-auto max-w-3xl mb-3">
          <QuickActionSuggestions onAction={handleQuickAction} />
        </div>
      )}

      {/* INPUT WRAPPER */}
      <div className="relative mx-auto flex max-w-3xl items-center">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          autoFocus
          className="
            w-full resize-none bg-white/90 backdrop-blur-sm
            border border-slate-300/60
            rounded-2xl px-4 pr-14 py-3
            text-sm leading-relaxed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900
            scrollbar-none shadow-sm
          "
        />

        {/* SEND BUTTON OVERLAY */}
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={disabled}
          className="
            absolute right-3 bottom-3
            h-9 w-9 rounded-full shadow-sm
          "
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* KEYBOARD HINT */}
      <p className="mt-2 text-center text-[11px] text-slate-500">
        Press <span className="font-medium">Enter</span> to send •{" "}
        <span className="font-medium">Shift+Enter</span> for a new line
      </p>
    </div>
  );
}

interface QuickActionSuggestionsProps {
  onAction: (message: string) => void;
}

const suggestions = [
  {
    label: "Help me explain my idea",
    icon: Lightbulb,
    message: "Help me articulate my idea clearly.",
  },
  {
    label: "Suggest a user persona",
    icon: MessageCircle,
    message: "Suggest a target user persona for my idea.",
  },
  {
    label: "Generate competitor list",
    icon: Target,
    message: "Generate a list of competitors for this idea.",
  },
];

function QuickActionSuggestions({ onAction }: QuickActionSuggestionsProps) {
  const isMobile = useIsMobile();
  // Show only 2 suggestions on mobile, all 3 on desktop
  const displayedSuggestions = isMobile ? suggestions.slice(0, 1) : suggestions;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedSuggestions.map((item) => (
        <Button
          key={item.label}
          variant="outline"
          size="sm"
          onClick={() => onAction(item.message)}
          className="rounded-full text-xs flex items-center gap-1.5 bg-white hover:bg-slate-50 border-slate-200"
        >
          <item.icon className="h-3 w-3 opacity-70" />
          {item.label}
        </Button>
      ))}
    </div>
  );
}
