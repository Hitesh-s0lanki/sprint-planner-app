import ChatUI from "./components/chat-ui";

export default function ConversationsPage() {
  return (
    <div className="h-screen w-full flex">
      {/* Sidebar optional */}
      <div className="w-64 border-r p-4 hidden md:block">
        <h2 className="text-xl font-bold">Conversations</h2>
      </div>

      {/* Main Chat UI */}
      <div className="flex-1">
        <ChatUI />
      </div>
    </div>
  );
}
