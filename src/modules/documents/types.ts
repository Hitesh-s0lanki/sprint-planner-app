import { Block } from "@blocknote/core";

export type Document = {
  id: string;
  title: string;
  icon?: string;
  content: Block[] | null;
  updatedAt: Date;
};
