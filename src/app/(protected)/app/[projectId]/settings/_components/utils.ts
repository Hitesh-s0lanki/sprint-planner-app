export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleBadgeVariant(
  role: string
): "default" | "secondary" | "outline" {
  if (role === "Owner" || role === "Admin") return "default";
  return "secondary";
}

