"use server";

import type {
  InvestorConversation,
  InvestorMessage,
  InvestorSummary,
  InterestLevel,
} from "../types";

// Mock UUIDs for conversations
const MOCK_CONV_IDS = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
  "00000000-0000-0000-0000-000000000006",
];

// Mock data generator
const generateMockConversations = (projectId: string): InvestorConversation[] => {
  return [
    {
      id: MOCK_CONV_IDS[0],
      projectId,
      investorNumber: 1,
      rank: "tier_a_vc",
      interestLevel: "high",
      isRead: false,
      unreadCount: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
      lastMessageAt: new Date(Date.now() - 18 * 60 * 1000),
    },
    {
      id: MOCK_CONV_IDS[1],
      projectId,
      investorNumber: 2,
      rank: "angel",
      interestLevel: "warm",
      isRead: true,
      unreadCount: 0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: MOCK_CONV_IDS[2],
      projectId,
      investorNumber: 3,
      rank: "micro_gp",
      interestLevel: "exploring",
      isRead: false,
      unreadCount: 1,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: MOCK_CONV_IDS[3],
      projectId,
      investorNumber: 4,
      rank: "tier_b_vc",
      interestLevel: "high",
      isRead: true,
      unreadCount: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: MOCK_CONV_IDS[4],
      projectId,
      investorNumber: 5,
      rank: "syndicate",
      interestLevel: "warm",
      isRead: false,
      unreadCount: 3,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      lastMessageAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: MOCK_CONV_IDS[5],
      projectId,
      investorNumber: 6,
      rank: "angel",
      interestLevel: "exploring",
      isRead: true,
      unreadCount: 0,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];
};

// Mock message IDs
const generateMessageId = (index: number) =>
  `00000000-0000-0000-0000-${String(index).padStart(12, "0")}`;

const generateMockMessages = (conversationId: string): InvestorMessage[] => {
  const baseTime = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago

  return [
    {
      id: generateMessageId(1),
      conversationId,
      body: "Hi, I'm interested in learning more about your market size and competitive moat. Can you share some insights?",
      senderType: "investor",
      tags: "Asking: Market Size, Concern: Moat",
      createdAt: new Date(baseTime),
    },
    {
      id: generateMessageId(2),
      conversationId,
      body: "Thanks for reaching out! Our TAM is approximately $2.5B, and we've identified three key differentiators: proprietary data, network effects, and regulatory expertise.",
      senderType: "founder",
      tags: null,
      createdAt: new Date(baseTime + 2 * 60 * 60 * 1000), // 2 hours later
    },
    {
      id: generateMessageId(3),
      conversationId,
      body: "That's helpful. What's your customer acquisition strategy?",
      senderType: "investor",
      tags: "Asking: Customer Acquisition",
      createdAt: new Date(baseTime + 4 * 60 * 60 * 1000), // 4 hours later
    },
    {
      id: generateMessageId(4),
      conversationId,
      body: "We focus on content marketing, partnerships with key industry players, and a referral program that's been driving 40% of our new customers.",
      senderType: "founder",
      tags: null,
      createdAt: new Date(baseTime + 6 * 60 * 60 * 1000), // 6 hours later
    },
    {
      id: generateMessageId(5),
      conversationId,
      body: "Interesting. Can you share your roadmap for the next 6 months?",
      senderType: "investor",
      tags: "Asking: Roadmap",
      createdAt: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
    },
  ];
};

/**
 * Get investor summary statistics for a project (MOCK DATA)
 * Only counts investors who have sent at least one message
 */
export async function getInvestorSummary(
  projectId: string
): Promise<InvestorSummary> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allConversations = generateMockConversations(projectId);

  // Filter: Only count conversations where investor has sent at least one message
  const conversations = allConversations.filter((conv) => {
    const messages = generateMockMessages(conv.id);
    const storedMessages = messageStore.get(conv.id) || [];
    const allMessages = [...messages, ...storedMessages];
    return allMessages.some((msg) => msg.senderType === "investor");
  });

  const totalInvestors = conversations.length;
  const highInterest = conversations.filter(
    (c) => c.interestLevel === "high"
  ).length;
  const warm = conversations.filter((c) => c.interestLevel === "warm").length;
  const exploring = conversations.filter(
    (c) => c.interestLevel === "exploring"
  ).length;

  const lastActivity =
    conversations
      .map((c) => c.lastMessageAt)
      .filter((date): date is Date => date !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0] || null;

  return {
    totalInvestors,
    highInterest,
    warm,
    exploring,
    lastActivity,
  };
}

/**
 * Get all conversations for a project with optional filters (MOCK DATA)
 * Only returns conversations where the investor has sent at least one message
 */
export async function getInvestorConversations(
  projectId: string,
  filters?: {
    interestLevel?: InterestLevel;
    sortBy?: "recent" | "highest_interest" | "oldest";
  }
): Promise<InvestorConversation[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  let conversations = generateMockConversations(projectId);

  // Filter: Only show conversations where investor has sent at least one message
  // Check if there are any investor messages for each conversation
  const conversationsWithInvestorMessages = conversations.filter((conv) => {
    const messages = generateMockMessages(conv.id);
    const storedMessages = messageStore.get(conv.id) || [];
    const allMessages = [...messages, ...storedMessages];
    // Only include if there's at least one investor message
    return allMessages.some((msg) => msg.senderType === "investor");
  });

  conversations = conversationsWithInvestorMessages;

  // Apply interest level filter
  if (filters?.interestLevel) {
    conversations = conversations.filter(
      (c) => c.interestLevel === filters.interestLevel
    );
  }

  // Apply sorting
  if (filters?.sortBy === "recent") {
    conversations = conversations.sort(
      (a, b) =>
        (b.lastMessageAt?.getTime() || 0) -
        (a.lastMessageAt?.getTime() || 0)
    );
  } else if (filters?.sortBy === "highest_interest") {
    const interestOrder = { high: 3, warm: 2, exploring: 1 };
    conversations = conversations.sort(
      (a, b) =>
        interestOrder[b.interestLevel as keyof typeof interestOrder] -
        interestOrder[a.interestLevel as keyof typeof interestOrder]
    );
  } else if (filters?.sortBy === "oldest") {
    conversations = conversations.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  } else {
    // Default: recent
    conversations = conversations.sort(
      (a, b) =>
        (b.lastMessageAt?.getTime() || 0) -
        (a.lastMessageAt?.getTime() || 0)
    );
  }

  return conversations;
}

/**
 * Get messages for a conversation (MOCK DATA)
 */
export async function getConversationMessages(
  conversationId: string
): Promise<InvestorMessage[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return generateMockMessages(conversationId);
}

// In-memory store for new messages (for demo purposes)
const messageStore = new Map<string, InvestorMessage[]>();

/**
 * Send a message (from founder to investor) - MOCK DATA
 */
export async function sendInvestorMessage(
  conversationId: string,
  body: string,
  tags?: string
): Promise<InvestorMessage> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newMessage: InvestorMessage = {
    id: generateMessageId(Date.now()),
    conversationId,
    body,
    senderType: "founder",
    tags: tags || null,
    createdAt: new Date(),
  };

  // Store in memory (for demo)
  if (!messageStore.has(conversationId)) {
    messageStore.set(conversationId, generateMockMessages(conversationId));
  }
  const messages = messageStore.get(conversationId)!;
  messages.push(newMessage);
  messageStore.set(conversationId, messages);

  return newMessage;
}

/**
 * Mark a conversation as read - MOCK DATA
 */
export async function markConversationRead(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _conversationId: string
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  // In a real implementation, this would update the database
  // For now, it's just a no-op since we're using mock data
}

/**
 * Get messages with in-memory updates (for demo)
 */
export async function getConversationMessagesWithUpdates(
  conversationId: string
): Promise<InvestorMessage[]> {
  const baseMessages = generateMockMessages(conversationId);
  const storedMessages = messageStore.get(conversationId);

  if (storedMessages) {
    // Merge and sort by createdAt
    const allMessages = [...baseMessages, ...storedMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    return allMessages;
  }

  return baseMessages;
}
