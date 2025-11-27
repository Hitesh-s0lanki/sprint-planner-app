"use client";

import { useState } from "react";
import { SettingsContent, ProjectData } from "./_components/settings-content";
import { dummyProject } from "./_components/settings-data";

export default function SettingsPage() {
  const [project, setProject] = useState<ProjectData>(dummyProject);

  const handleSaveProject = (data: { name: string; description: string }) => {
    setProject({ ...project, ...data });
  };

  return (
    <div className="flex flex-col gap-0 w-full py-8 px-6 md:px-10 lg:px-20">
      <SettingsContent project={project} onSaveProject={handleSaveProject} />
    </div>
  );
}
