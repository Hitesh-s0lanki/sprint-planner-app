import { cn } from "@/lib/utils";

interface PageRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

export function PageRow({
  icon,
  title,
  subtitle,
  right,
  onClick,
}: PageRowProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-3 border ",
        "py-2",
        "hover:bg-muted/40 rounded-md px-2 -mx-2 transition-colors",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <span className="shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-sm ">{title}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}
