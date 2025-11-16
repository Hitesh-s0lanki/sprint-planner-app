"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboard() {
  const router = useRouter();

  useEffect(() => {
    async function createUser() {
      try {
        const res = await fetch("/api/create-user", { method: "POST" });

        if (res.ok) {
          router.push("/"); // redirect when user is created
        } else {
          console.error("User creation failed");
        }
      } catch (err) {
        console.error(err);
      }
    }

    createUser();
  }, [router]);

  return (
    <div className="p-10">
      <h1>Setting up your account…</h1>
    </div>
  );
}
