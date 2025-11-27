"use server";

import { db } from "@/lib/db";
import { documents } from "@/db/documents";
import { createDocumentSchema, updateDocumentSchema } from "../schema";
import z from "zod";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get all documents for a project
 * @param projectId - The project ID to fetch documents for
 * @returns Array of documents
 */
export async function getAllDocuments(projectId: string) {
  try {
    const allDocuments = await db
      .select()
      .from(documents)
      .where(
        and(eq(documents.projectId, projectId), eq(documents.isTrashed, false))
      )
      .orderBy(desc(documents.updatedAt));

    return allDocuments;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

/**
 * Get a document by ID
 * @param documentId - The document ID to fetch
 * @returns Document or null if not found
 */
export async function getDocumentById(documentId: string) {
  try {
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    return document[0] || null;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error("Failed to fetch document");
  }
}

export const createDocument = async (
  data: z.infer<typeof createDocumentSchema>
) => {
  try {
    const validatedData = createDocumentSchema.parse(data);
    const [document] = await db
      .insert(documents)
      .values({
        title: validatedData.title,
        icon: validatedData.icon,
        content: validatedData.content || [],
        projectId: validatedData.projectId,
      })
      .returning();
    return document;
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }
};

export const updateDocument = async (
  data: z.infer<typeof updateDocumentSchema>
) => {
  try {
    const validatedData = updateDocumentSchema.parse(data);
    const updateData: {
      title?: string;
      icon?: string | null;
      content?: unknown;
      updatedAt?: Date;
    } = {
      updatedAt: new Date(),
    };

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }
    if (validatedData.icon !== undefined) {
      updateData.icon = validatedData.icon || null;
    }
    if (validatedData.content !== undefined) {
      updateData.content = validatedData.content;
    }

    const [document] = await db
      .update(documents)
      .set(updateData)
      .where(eq(documents.id, validatedData.id))
      .returning();

    return document;
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }
};

export const deleteDocument = async (id: string) => {
  try {
    // Soft delete - move to trash
    const [document] = await db
      .update(documents)
      .set({
        isTrashed: true,
        trashedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return document;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
};
