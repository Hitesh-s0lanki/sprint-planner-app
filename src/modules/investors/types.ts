export type InterestLevel = "high" | "warm" | "exploring";
export type InvestorRank =
  | "tier_a_vc"
  | "tier_b_vc"
  | "angel"
  | "micro_gp"
  | "syndicate"
  | "other";

export interface InvestorConversation {
  id: string;
  projectId: string;
  investorNumber: number;
  rank: InvestorRank;
  interestLevel: InterestLevel;
  isRead: boolean;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date | null;
}

export interface InvestorMessage {
  id: string;
  conversationId: string;
  body: string;
  senderType: "investor" | "founder";
  tags: string | null;
  createdAt: Date;
}

export interface InvestorSummary {
  totalInvestors: number;
  highInterest: number;
  warm: number;
  exploring: number;
  lastActivity: Date | null;
}

export interface ConversationWithMessages extends InvestorConversation {
  messages: InvestorMessage[];
}

