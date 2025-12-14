interface NotionInlineSelectProps {
  valueLabel: React.ReactNode;
  children?: React.ReactNode;
}

export function NotionInlineSelect({
  valueLabel,
  children,
}: NotionInlineSelectProps) {
  // Notion-like: looks like plain text but clickable
  return (
    <div className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-muted/60 transition-colors">
      {valueLabel}
      {children}
    </div>
  );
}
