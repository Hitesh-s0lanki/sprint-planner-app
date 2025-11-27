"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { SourcesLayout } from "./_components/sources-layout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document as SourceDocument } from "@/modules/documents/types";
import { toast } from "sonner";

export default function SourcesPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  // Build query options once so we can reuse queryKey for invalidation
  const getAllQueryOptions = trpc.documents.getAll.queryOptions({ projectId });

  // Fetch documents
  const { data: documentsData } = useQuery(getAllQueryOptions);

  const docs: SourceDocument[] =
    (documentsData as { data?: { items?: SourceDocument[] } })?.data?.items ||
    [];

  const createMutation = useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: async (res) => {
        toast.success(res.message);

        // refetch list
        await queryClient.invalidateQueries({
          queryKey: getAllQueryOptions.queryKey,
        });

        if (res.data?.item) {
          setActiveDocId(res.data.item.id);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create document");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.documents.update.mutationOptions({
      onSuccess: async (res) => {
        toast.success(res.message);

        // refetch list (title/icon changes, etc.)
        await queryClient.invalidateQueries({
          queryKey: getAllQueryOptions.queryKey,
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update document");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.documents.delete.mutationOptions({
      onSuccess: async (res) => {
        toast.success(res.message);

        // refetch list after delete
        await queryClient.invalidateQueries({
          queryKey: getAllQueryOptions.queryKey,
        });

        // optionally reset activeDocId here if needed
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete document");
      },
    })
  );

  // Create a new document
  const handleCreateDoc = useCallback(async () => {
    try {
      await createMutation.mutateAsync({
        projectId,
        title: "Untitled",
        content: null,
      });
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }, [projectId, createMutation]);

  // Select a document
  const handleSelectDoc = useCallback((id: string) => {
    setActiveDocId(id);
  }, []);

  // Local-only update hook (still here if you want to debounce saves, etc.)
  const handleUpdateDoc = useCallback(() => {
    // For local state updates only
    // Actual save happens via handleSaveDoc
  }, []);

  // Save document to server
  const handleSaveDoc = useCallback(
    async (id: string, updates: Partial<SourceDocument>) => {
      try {
        await updateMutation.mutateAsync({
          id,
          title: updates.title,
          content: updates.content,
          icon: updates.icon,
        });
      } catch (error) {
        console.error("Error saving document:", error);
        throw error;
      }
    },
    [updateMutation]
  );

  // Delete a document
  const handleDeleteDoc = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync({ documentId: id });
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    },
    [deleteMutation]
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <SourcesLayout
        docs={docs}
        activeDocId={activeDocId}
        onCreateDoc={handleCreateDoc}
        onSelectDoc={handleSelectDoc}
        onUpdateDoc={handleUpdateDoc}
        onSaveDoc={handleSaveDoc}
        onDeleteDoc={handleDeleteDoc}
      />
    </div>
  );
}
