"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { GenerateAvatar } from "@/components/ui/generate-avatar";
import { User, Briefcase, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  profession: z.string().max(100, "Profession is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const hasInitializedRef = useRef(false);
  const previousUserRef = useRef<ProfileFormValues | null>(null);

  // Build query options for fetching profile
  const getProfileQueryOptions = trpc.clerkAuth.getProfile.queryOptions();

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery({
    ...getProfileQueryOptions,
    enabled: open, // Only fetch when sheet is open
  });

  const user = (profileData as { data?: { item?: ProfileFormValues } })?.data
    ?.item;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      profession: "",
      description: "",
    },
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      const userData = {
        name: user.name || "",
        profession: user.profession || "",
        description: user.description || "",
      };

      // Only reset if data has changed
      if (
        JSON.stringify(previousUserRef.current) !== JSON.stringify(userData)
      ) {
        form.reset(userData);
        previousUserRef.current = userData;
        hasInitializedRef.current = true;
      }
    }
  }, [user, form]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      hasInitializedRef.current = false;
      if (user) {
        const userData = {
          name: user.name || "",
          profession: user.profession || "",
          description: user.description || "",
        };
        form.reset(userData);
        previousUserRef.current = userData;
      }
    }
  }, [open, user, form]);

  // Update profile mutation
  const updateMutation = useMutation(
    trpc.clerkAuth.updateProfile.mutationOptions({
      onSuccess: async (res) => {
        toast.success(res.message || "Profile updated successfully");

        // Invalidate and refetch profile
        await queryClient.invalidateQueries({
          queryKey: getProfileQueryOptions.queryKey,
        });

        // Close sheet after successful update
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update profile");
      },
    })
  );

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        profession: values.profession || undefined,
        description: values.description || undefined,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      form.reset({
        name: user.name || "",
        profession: user.profession || "",
        description: user.description || "",
      });
    }
    onOpenChange(false);
  };

  const getUserName = () => {
    return user?.name || "User";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="min-w-2xl sm:w-[540px] p-0 overflow-y-auto"
      >
        {/* Hidden title for accessibility - required by Radix UI Dialog */}
        <SheetTitle className="sr-only">Profile Settings</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header Section with Avatar */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b bg-linear-to-br from-primary/5 via-background to-background">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <GenerateAvatar
                  seed={getUserName()}
                  variant="initials"
                  className="size-16 ring-2 ring-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 size-5 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="flex-1 pt-2">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold mb-1">
                      {getUserName()}
                    </h2>
                    <SheetDescription className="text-base">
                      {user?.profession || "Update your profile information"}
                    </SheetDescription>
                  </>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Form Content */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  id="profile-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="h-11 border-slate-200 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          This is your display name that will be visible to
                          others
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Profession Field */}
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <div className="flex items-center justify-center size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          Profession
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Software Engineer, Product Manager"
                            className="h-11 border-slate-200 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Your current job title or profession
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <div className="flex items-center justify-center size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself, your interests, or your background..."
                            className="min-h-[140px] border-slate-200 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          A brief description about yourself, your interests, or
                          your background (max 1000 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </div>

          {/* Footer with Actions */}
          {!isLoading && (
            <div className="border-t bg-muted/30 px-6 py-4 mt-auto">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="profile-form"
                  disabled={updateMutation.isPending}
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
