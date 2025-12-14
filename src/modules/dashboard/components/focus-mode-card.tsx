import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function FocusModeCard() {
  return (
    <Card className="rounded-2xl border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Focus Mode</CardTitle>
        <p className="text-xs text-muted-foreground">
          Hide distractions and focus on your tasks.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="focus-mode" className="text-sm">
            Enable Focus Mode
          </Label>
          <Switch id="focus-mode" />
        </div>
      </CardContent>
    </Card>
  );
}
