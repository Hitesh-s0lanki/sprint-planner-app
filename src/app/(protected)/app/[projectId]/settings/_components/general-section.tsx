"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { ProjectData } from "./types";

interface GeneralSectionProps {
  project: ProjectData;
  onSaveProject: (data: { name: string; description: string }) => void;
}

export function GeneralSection({
  project,
  onSaveProject,
}: GeneralSectionProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSave = () => {
    onSaveProject({ name, description });
    toast.success("Project settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">General</h1>
            <p className="text-sm text-muted-foreground">
              Manage your project information and preferences
            </p>
          </div>
        </div>
      </header>

      {/* Project Profile Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Project Profile</CardTitle>
          <CardDescription>
            Update the name and description of this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Project Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-start gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setName(project.name);
              setDescription(project.description);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
