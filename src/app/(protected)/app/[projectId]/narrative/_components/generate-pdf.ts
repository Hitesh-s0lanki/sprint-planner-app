import jsPDF from "jspdf";
import type {
  NarrativeSection,
  NarrativeCategory,
} from "@/modules/narrative/types";
import { categoryLabels } from "@/modules/narrative/types";

interface GeneratePDFOptions {
  sections: Record<NarrativeCategory, NarrativeSection[]>;
  projectName?: string;
}

/**
 * Parse markdown content and extract text with formatting hints
 */
function parseMarkdown(content: string): Array<{
  type: "heading" | "paragraph" | "list" | "text";
  level?: number;
  text: string;
}> {
  const lines = content.split("\n");
  const result: Array<{
    type: "heading" | "paragraph" | "list" | "text";
    level?: number;
    text: string;
  }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for headings (# ## ###)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      result.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    // Check for list items (- or *)
    const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      result.push({
        type: "list",
        text: listMatch[1],
      });
      continue;
    }

    // Check for numbered list
    const numberedListMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedListMatch) {
      result.push({
        type: "list",
        text: numberedListMatch[1],
      });
      continue;
    }

    // Regular paragraph
    result.push({
      type: "paragraph",
      text: trimmed,
    });
  }

  return result;
}

export function generateNarrativePDF({
  sections,
  projectName = "Project Narrative",
}: GeneratePDFOptions): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper to add a new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to add spacing
  const addSpacing = (spacing: number) => {
    checkPageBreak(spacing);
    yPosition += spacing;
  };

  // Helper to add text with word wrap and proper formatting
  const addText = (
    text: string,
    fontSize: number,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0],
    lineHeight: number = 1.4,
    spacingAfter: number = 3
  ) => {
    if (!text || text.trim() === "") return;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text.trim(), maxWidth);
    const totalHeight = lines.length * fontSize * lineHeight;

    checkPageBreak(totalHeight + spacingAfter);

    for (const line of lines) {
      doc.text(line, margin, yPosition);
      yPosition += fontSize * lineHeight;
    }

    yPosition += spacingAfter;
  };

  // Title
  addText(projectName, 22, true, [0, 0, 0], 1.5, 8);

  // Date
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  addText(`Generated on ${date}`, 10, false, [120, 120, 120], 1.3, 15);

  // Add a horizontal line separator
  checkPageBreak(5);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Iterate through categories
  const categories: NarrativeCategory[] = [
    "narrative",
    "product",
    "engineering",
    "administrative",
    "people_hr",
    "gtm",
    "funding",
    "tools",
  ];

  for (const category of categories) {
    const categorySections = sections[category];
    if (!categorySections || categorySections.length === 0) continue;

    // Category heading with better spacing
    checkPageBreak(25);
    addSpacing(8);

    // Category title with underline effect
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    const categoryTitle = categoryLabels[category] || category;
    const categoryLines = doc.splitTextToSize(categoryTitle, maxWidth);
    checkPageBreak(categoryLines.length * 18 * 1.4 + 8);

    for (const line of categoryLines) {
      doc.text(line, margin, yPosition);
      yPosition += 18 * 1.4;
    }

    // Add underline
    yPosition += 2;
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Sections in this category
    for (const section of categorySections) {
      checkPageBreak(25);

      // Section name with better formatting
      addText(section.name, 14, true, [0, 0, 0], 1.5, 6);

      // Parse and add section content
      if (section.content && section.content.trim()) {
        const parsed = parseMarkdown(section.content);
        let inList = false;

        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          const nextItem = parsed[i + 1];
          const isLastInList =
            item.type === "list" && nextItem?.type !== "list";

          switch (item.type) {
            case "heading":
              // Add spacing before heading (except if it's the first element)
              if (i > 0) {
                addSpacing(4);
              }

              const headingSize =
                item.level === 1 ? 13 : item.level === 2 ? 12 : 11;
              const headingColor: [number, number, number] =
                item.level === 1 ? [30, 30, 30] : [60, 60, 60];

              addText(item.text, headingSize, true, headingColor, 1.4, 4);
              inList = false;
              break;

            case "list":
              if (!inList) {
                // Start of a new list
                addSpacing(2);
                inList = true;
              }

              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);

              const bullet = "•";
              const listText = item.text;
              const listLines = doc.splitTextToSize(listText, maxWidth - 15);
              const listHeight = listLines.length * 10 * 1.3;

              checkPageBreak(listHeight + (isLastInList ? 4 : 2));

              // Draw bullet and text
              for (let j = 0; j < listLines.length; j++) {
                if (j === 0) {
                  doc.text(bullet, margin + 5, yPosition);
                  doc.text(listLines[j], margin + 12, yPosition);
                } else {
                  // Indent wrapped lines
                  doc.text(listLines[j], margin + 12, yPosition);
                }
                yPosition += 10 * 1.3;
              }

              if (isLastInList) {
                yPosition += 4;
                inList = false;
              } else {
                yPosition += 1;
              }
              break;

            case "paragraph":
            default:
              if (inList) {
                inList = false;
                addSpacing(2);
              }

              // Add spacing before paragraph if it's not the first element
              if (i > 0 && parsed[i - 1].type !== "list") {
                addSpacing(2);
              }

              addText(item.text, 10, false, [0, 0, 0], 1.5, 4);
              break;
          }
        }
      } else {
        // Empty section
        addSpacing(4);
      }

      // Gap between sections
      addSpacing(8);

      // Add subtle separator line between sections
      checkPageBreak(3);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    }

    // Gap between categories
    addSpacing(12);
  }

  // Save the PDF
  doc.save(`${projectName.replace(/\s+/g, "_")}_Narrative.pdf`);
}


