"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InvestorSentimentStrip } from "./_components/investor-sentiment-strip";
import { InvestorThreadList } from "./_components/investor-thread-list";
import { InvestorConversationView } from "./_components/investor-conversation-view";
import type {
  InvestorConversation,
  InvestorMessage,
  InvestorSummary,
  InterestLevel,
} from "@/modules/investors/types";

export default function SocialPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<InterestLevel | "all">("all");
  const [sort, setSort] = useState<"recent" | "highest_interest" | "oldest">(
    "recent"
  );
  const [showThreadList, setShowThreadList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userToggledThreadList, setUserToggledThreadList] = useState(false);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Derive showThreadList from activeConversationId and isMobile
  // Only override with state if user explicitly toggled it
  const shouldShowThreadList = useMemo(() => {
    if (userToggledThreadList) {
      return showThreadList;
    }
    // On mobile, show thread list when no conversation is selected
    if (isMobile && !activeConversationId) {
      return true;
    }
    // On desktop, always show thread list
    if (!isMobile) {
      return true;
    }
    // On mobile with conversation, hide thread list
    return false;
  }, [isMobile, activeConversationId, showThreadList, userToggledThreadList]);

  // Fetch summary
  const summaryQueryOptions = trpc.investors.getSummary.queryOptions({
    projectId,
  });
  const { data: summaryData, isLoading: isLoadingSummary } =
    useQuery(summaryQueryOptions);
  const summary: InvestorSummary | null =
    (summaryData as { data?: { item?: InvestorSummary } })?.data?.item || null;

  // Fetch conversations
  const conversationsQueryOptions =
    trpc.investors.getConversations.queryOptions({
      projectId,
      interestLevel: filter !== "all" ? filter : undefined,
      sortBy: sort,
    });
  const { data: conversationsData, isLoading: isLoadingConversations } =
    useQuery(conversationsQueryOptions);

  // Memoize conversations to prevent unnecessary re-renders
  const conversations: InvestorConversation[] = useMemo(() => {
    return (
      (conversationsData as { data?: { items?: InvestorConversation[] } })?.data
        ?.items || []
    );
  }, [conversationsData]);

  // Fetch messages for active conversation
  const messagesQueryOptions = trpc.investors.getMessages.queryOptions({
    conversationId: activeConversationId || "",
  });
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    ...messagesQueryOptions,
    enabled: !!activeConversationId,
  });
  const messages: InvestorMessage[] =
    (messagesData as { data?: { items?: InvestorMessage[] } })?.data?.items ||
    [];

  // Get active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  // Send message mutation
  const sendMessageMutation = useMutation(
    trpc.investors.sendMessage.mutationOptions({
      onSuccess: async () => {
        toast.success("Message sent successfully");

        // Invalidate messages query to show new message
        await queryClient.invalidateQueries({
          queryKey: messagesQueryOptions.queryKey,
        });

        // Invalidate conversations query to update lastMessageAt
        await queryClient.invalidateQueries({
          queryKey: conversationsQueryOptions.queryKey,
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to send message");
      },
    })
  );

  // Mark as read mutation
  const markReadMutation = useMutation(
    trpc.investors.markRead.mutationOptions({
      onSuccess: async () => {
        // Invalidate conversations query to update read status
        await queryClient.invalidateQueries({
          queryKey: conversationsQueryOptions.queryKey,
        });
      },
    })
  );

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      // Mark as read when selected
      markReadMutation.mutate({ conversationId: id });
      // Mark that user interacted, so we respect their choice
      if (isMobile) {
        setUserToggledThreadList(true);
        setShowThreadList(false);
      }
    },
    [markReadMutation, isMobile]
  );

  // Handle sending message
  const handleSendMessage = useCallback(
    async (body: string, tags?: string) => {
      if (!activeConversationId) return;

      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        body,
        tags,
      });
    },
    [activeConversationId, sendMessageMutation]
  );

  // Track if we've already auto-selected to prevent cascading renders
  const hasAutoSelectedRef = useRef(false);
  const firstConversationId = useMemo(
    () => conversations[0]?.id ?? null,
    [conversations]
  );

  // Auto-select first conversation if none selected (only on desktop)
  useEffect(() => {
    if (
      !activeConversationId &&
      firstConversationId &&
      !isLoadingConversations &&
      !hasAutoSelectedRef.current &&
      !isMobile
    ) {
      hasAutoSelectedRef.current = true;
      // Use requestAnimationFrame to defer state update
      requestAnimationFrame(() => {
        setActiveConversationId(firstConversationId);
        markReadMutation.mutate({ conversationId: firstConversationId });
      });
    }

    // Reset flag when conversations change
    if (conversations.length === 0) {
      hasAutoSelectedRef.current = false;
    }
  }, [
    activeConversationId,
    firstConversationId,
    isLoadingConversations,
    markReadMutation,
    conversations.length,
    isMobile,
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      {/* Sentiment Strip */}
      <div className="relative shrink-0">
        <InvestorSentimentStrip
          summary={summary}
          isLoading={isLoadingSummary}
        />
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column - Thread List */}
        <div
          className={`
            ${shouldShowThreadList ? "flex" : "hidden"}
            md:flex
            flex-col
            h-full
            border-r
            bg-background
            w-full
            md:w-[35%]
            lg:w-[320px]
            shrink-0
          `}
        >
          <InvestorThreadList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoadingConversations}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </div>

        {/* Right Column - Conversation View */}
        <div
          className={`
            ${shouldShowThreadList ? "hidden md:flex" : "flex"}
            flex-col
            h-full
            bg-background
            flex-1
            min-w-0
          `}
        >
          <InvestorConversationView
            conversation={activeConversation}
            messages={messages}
            isLoading={isLoadingConversations}
            isLoadingMessages={isLoadingMessages}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setUserToggledThreadList(true);
              setShowThreadList(true);
            }}
            showBackButton={
              !shouldShowThreadList && activeConversationId !== null
            }
          />
        </div>
      </div>
    </div>
  );
}
