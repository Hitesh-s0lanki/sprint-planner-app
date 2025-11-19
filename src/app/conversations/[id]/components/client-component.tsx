"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatPanel from "./chat-panel";
import RightPanel from "./right-panel";

export default function ConversationPage({ initialPrompt }: any) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <PanelGroup direction="horizontal" className="h-full">

        {/* LEFT CHAT PANEL */}
        <Panel defaultSize={30} minSize={30}>
          <ChatPanel initialPrompt={initialPrompt} />
        </Panel>

        {/* DRAG HANDLE */}
        <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400 transition cursor-col-resize" />

        {/* RIGHT PANEL */}
        <Panel defaultSize={45} minSize={25}>
          <RightPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}
