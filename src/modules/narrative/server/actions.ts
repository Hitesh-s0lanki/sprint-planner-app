"use server";

import { db } from "@/lib/db";
import { narrativeSections } from "@/db/narrative";
import { eq, asc, and } from "drizzle-orm";
import type {
  NarrativeCategory,
  NarrativeSectionType,
  NarrativeSection,
} from "../types";

/**
 * Get all narrative sections for a project, grouped by category
 * @param projectId - The project ID to fetch sections for
 * @returns Record of category to array of sections
 */
export async function getAllNarrativeSections(
  projectId: string
): Promise<Record<NarrativeCategory, NarrativeSection[]>> {
  try {
    const allSections = await db
      .select()
      .from(narrativeSections)
      .where(eq(narrativeSections.projectId, projectId))
      .orderBy(
        asc(narrativeSections.category),
        asc(narrativeSections.position)
      );

    // Initialize all categories with empty arrays
    const result: Record<NarrativeCategory, NarrativeSection[]> = {
      narrative: [],
      product: [],
      engineering: [],
      administrative: [],
      people_hr: [],
      gtm: [],
      funding: [],
      tools: [],
    };

    // Group sections by category
    for (const section of allSections) {
      const category = section.category as NarrativeCategory;
      if (result[category]) {
        result[category].push({
          id: section.id,
          projectId: section.projectId,
          category: section.category as NarrativeCategory,
          name: section.name,
          type: section.type as NarrativeSectionType,
          content: section.content,
          position: section.position,
          createdAt:
            section.createdAt instanceof Date
              ? section.createdAt
              : new Date(section.createdAt),
          updatedAt:
            section.updatedAt instanceof Date
              ? section.updatedAt
              : new Date(section.updatedAt),
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching narrative sections:", error);
    throw new Error("Failed to fetch narrative sections");
  }
}

/**
 * Update a narrative section
 * @param sectionId - The section ID to update
 * @param updates - Partial section updates
 * @returns Updated section
 */
export async function updateNarrativeSection(
  sectionId: string,
  updates: Partial<{
    name: string;
    content: string;
    position: number;
    type: NarrativeSectionType;
  }>
) {
  try {
    const updateData: {
      name?: string;
      content?: string;
      position?: number;
      type?: NarrativeSectionType;
      updatedAt?: Date;
    } = {
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.content !== undefined) {
      updateData.content = updates.content;
    }
    if (updates.position !== undefined) {
      updateData.position = updates.position;
    }
    if (updates.type !== undefined) {
      updateData.type = updates.type;
    }

    const [section] = await db
      .update(narrativeSections)
      .set(updateData)
      .where(eq(narrativeSections.id, sectionId))
      .returning();

    if (!section) {
      throw new Error("Section not found");
    }

    return {
      id: section.id,
      projectId: section.projectId,
      category: section.category as NarrativeCategory,
      name: section.name,
      type: section.type as NarrativeSectionType,
      content: section.content,
      position: section.position,
      createdAt:
        section.createdAt instanceof Date
          ? section.createdAt
          : new Date(section.createdAt),
      updatedAt:
        section.updatedAt instanceof Date
          ? section.updatedAt
          : new Date(section.updatedAt),
    };
  } catch (error) {
    console.error("Error updating narrative section:", error);
    throw new Error("Failed to update narrative section");
  }
}

/**
 * Create a new narrative section
 * @param projectId - The project ID
 * @param category - The category for the section
 * @param name - The name of the section
 * @param type - The type of section (text or files)
 * @param content - Optional initial content
 * @returns Created section
 */
export async function createNarrativeSection(
  projectId: string,
  category: NarrativeCategory,
  name: string,
  type: NarrativeSectionType = "text",
  content: string = ""
) {
  try {
    // Get the max position for this category to append at the end
    const existingSections = await db
      .select()
      .from(narrativeSections)
      .where(
        and(
          eq(narrativeSections.projectId, projectId),
          eq(narrativeSections.category, category)
        )
      );

    const maxPosition =
      existingSections.length > 0
        ? Math.max(...existingSections.map((s) => s.position)) + 1
        : 0;

    const [section] = await db
      .insert(narrativeSections)
      .values({
        projectId,
        category,
        name,
        type,
        content,
        position: maxPosition,
      })
      .returning();

    if (!section) {
      throw new Error("Failed to create section");
    }

    return {
      id: section.id,
      projectId: section.projectId,
      category: section.category as NarrativeCategory,
      name: section.name,
      type: section.type as NarrativeSectionType,
      content: section.content,
      position: section.position,
      createdAt:
        section.createdAt instanceof Date
          ? section.createdAt
          : new Date(section.createdAt),
      updatedAt:
        section.updatedAt instanceof Date
          ? section.updatedAt
          : new Date(section.updatedAt),
    };
  } catch (error) {
    console.error("Error creating narrative section:", error);
    throw new Error("Failed to create narrative section");
  }
}
