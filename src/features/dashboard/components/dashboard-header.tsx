import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  project: {
    id: string;
    key: string;
    name: string;
    status: string;
  };
}

export function DashboardHeader({ project }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <span className="rounded-full border px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {project.status}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Dashboard for your 4-week sprint execution.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/app/${project.id}/board`)}
        >
          Go to Board
        </Button>
      </div>
    </div>
  );
}
