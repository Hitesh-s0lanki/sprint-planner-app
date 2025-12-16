import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sprint-planner-session-id";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the existing session cookie
    cookieStore.delete(SESSION_COOKIE_NAME);

    // Generate a new session ID
    const newSessionId = crypto.randomUUID();

    // Set the new session cookie
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: newSessionId,
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 5, // ~5 years
    });

    return NextResponse.json(
      {
        success: true,
        sessionId: newSessionId,
        message: "Session cleared and new session created",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear session" },
      { status: 500 }
    );
  }
}








