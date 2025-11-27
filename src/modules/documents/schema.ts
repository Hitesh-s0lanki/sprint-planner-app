import { z } from "zod";

// BlockNote Block type - array of blocks
const blockSchema = z.any(); // Using any for now, can be more specific with BlockNote types

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").default("Untitled"),
  icon: z.string().optional(),
  content: z.array(blockSchema).nullable().default(null),
  projectId: z.string().uuid("Invalid project ID format"),
});

export const updateDocumentSchema = z.object({
  id: z.string().uuid("Invalid document ID format"),
  title: z.string().min(1, "Title is required").optional(),
  icon: z.string().optional(),
  content: z.array(blockSchema).nullable().optional(),
});
