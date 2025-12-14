import { cn } from "@/lib/utils";

interface NotionPropProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function NotionProp({
  icon,
  label,
  children,
  className,
}: NotionPropProps) {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm", "min-w-0", className)}
    >
      <span className="text-muted-foreground shrink-0 flex items-center">
        {icon}
      </span>
      <span className="text-muted-foreground shrink-0 font-medium">
        {label}
      </span>
      <div className="min-w-0 flex items-center">{children}</div>
    </div>
  );
}
