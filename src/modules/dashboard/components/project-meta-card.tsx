import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Props {
  project: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
  };
}

export function ProjectMetaCard({ project }: Props) {
  const createdAt = parseISO(project.createdAt);

  return (
    <Card className="rounded-2xl border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Project Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Project Key</p>
          <p className="text-sm font-medium">{project.key}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          <Badge variant="secondary" className="mt-1">
            {project.status}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Description</p>
          <p className="text-sm text-muted-foreground">
            {project.description || "No description"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-sm">{format(createdAt, "MMM dd, yyyy")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
