"use client";

import { Separator } from "@/components/ui/separator";
import { GeneralSection } from "./general-section";
import { MembersSection } from "./members-section";
import { DangerZoneSection } from "./danger-zone-section";
import { ProjectData } from "./types";

interface SettingsContentProps {
  project: ProjectData;
  onSaveProject: (data: { name: string; description: string }) => void;
}

export function SettingsContent({
  project,
  onSaveProject,
}: SettingsContentProps) {
  return (
    <div className="space-y-12">
      {/* General Section */}
      <GeneralSection project={project} onSaveProject={onSaveProject} />

      <Separator className="my-8" />

      {/* Members Section */}
      <MembersSection />

      <Separator className="my-8" />

      {/* Danger Zone / Delete Section */}
      <DangerZoneSection />
    </div>
  );
}

export type { ProjectData } from "./types";
export type { Member, Invitation } from "./types";
