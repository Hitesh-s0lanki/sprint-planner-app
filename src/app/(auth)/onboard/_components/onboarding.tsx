"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Onboarding = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate: createUser } = useMutation(
    trpc.clerkAuth.createUser.mutationOptions({
      onSuccess: (res) => {
        toast.success(res.message);
        router.push(`/`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create user");
      },
    })
  );

  useEffect(() => {
    createUser();
  }, [createUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Setting up your account…</h1>
    </div>
  );
};

export default Onboarding;
