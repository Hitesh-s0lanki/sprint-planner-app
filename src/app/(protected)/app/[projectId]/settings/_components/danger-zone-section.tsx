"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DangerZoneSection() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-destructive">
              Danger Zone
            </h1>
            <p className="text-sm text-muted-foreground">
              Irreversible and destructive actions
            </p>
          </div>
        </div>
      </header>

      <Card className="border-2 border-destructive/40 bg-destructive/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Delete Project
          </CardTitle>
          <CardDescription>
            Once you delete a project, there is no going back. Please be
            certain. This will permanently delete the project and all associated
            data including sprints, tasks, and member associations.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-destructive" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-2">
                  This action cannot be undone. This will permanently delete the
                  project and all associated data including sprints, tasks, and
                  member associations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    toast.error("Project deletion not implemented yet");
                  }}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
