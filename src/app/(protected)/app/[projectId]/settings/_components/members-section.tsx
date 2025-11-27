"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Mail,
  Calendar,
  MoreVertical,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member, Invitation } from "./types";
import { getInitials, getRoleBadgeVariant } from "./utils";

export function MembersSection() {
  const [members] = useState<Member[]>([
    {
      id: 1,
      name: "Hitesh",
      email: "hitesh@example.com",
      role: "Owner",
      joined: "2024-01-15",
    },
  ]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [activeTab, setActiveTab] = useState("members");

  const handleSendInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    const newInvite: Invitation = {
      id: Date.now(),
      email: inviteEmail,
      role: inviteRole,
      invitedAt: new Date().toISOString().split("T")[0],
    };

    setInvites([...invites, newInvite]);
    setInviteEmail("");
    setInviteRole("Member");
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleCancelInvite = (id: number) => {
    setInvites(invites.filter((inv) => inv.id !== id));
    toast.success("Invitation cancelled");
  };

  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Members</h1>
            <p className="text-sm text-muted-foreground">
              View and manage members and invitations
            </p>
          </div>
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-slate-200">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Invite New Members Card */}
          <Card className="border-2 border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">Invite New Members</CardTitle>
              </div>
              <CardDescription>
                Enter an email to invite someone to this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="invite-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="name@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="h-10 pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role" className="text-sm font-medium">
                    Role
                  </Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger
                      id="invite-role"
                      className="w-full max-w-xl h-10"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setInviteEmail("");
                  setInviteRole("Member");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSendInvite}>
                <Send className="size-4 mr-2" />
                Send Invite
              </Button>
            </CardFooter>
          </Card>

          {/* Members List */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Project Members</CardTitle>
              <CardDescription>
                People who have access to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Joined</TableHead>
                        <TableHead className="text-right font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(member.role)}>
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="size-3.5" />
                              <span className="text-sm">
                                {new Date(member.joined).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {member.role !== "Owner" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem variant="destructive">
                                    <X className="size-4 mr-2" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                  <Users className="size-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No members yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invite team members to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Pending Invitations</CardTitle>
              <CardDescription>
                Invitations that have been sent but not yet accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invites.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Invited</TableHead>
                        <TableHead className="text-right font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.map((invite) => (
                        <TableRow key={invite.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Mail className="size-4 text-muted-foreground" />
                              {invite.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(invite.role)}>
                              {invite.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="size-3.5" />
                              <span className="text-sm">
                                {new Date(invite.invitedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendInvite(invite.email)}
                              >
                                <Send className="size-3.5 mr-1.5" />
                                Resend
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelInvite(invite.id)}
                              >
                                <X className="size-3.5 mr-1.5" />
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                  <Mail className="size-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No invites to display
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All invitations have been accepted or cancelled
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
