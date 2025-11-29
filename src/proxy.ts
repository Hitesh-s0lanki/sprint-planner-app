import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "sprint-planner-session-id";

const isPublicRoute = createRouteMatcher([
  // Public pages
  "/",
  "/about(.*)",
  "/contact(.*)",
  "/investors(.*)",

  // Auth routes
  "/sign-in(.*)",
  "/sign-up(.*)",

  // API routes
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isPublic = isPublicRoute(req);

  let res: NextResponse;

  // If route is protected and user is not authenticated -> redirect
  if (!isPublic && !userId) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("redirect_url", req.url);
    res = NextResponse.redirect(url);
  } else {
    // For public routes or authenticated protected routes
    res = NextResponse.next();
  }

  // ---- Session cookie logic (runs for ALL responses: redirect + normal) ----
  const existing = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!existing) {
    const newId = crypto.randomUUID();

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newId,
      httpOnly: false, // set to true if you don't need it in client JS
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Long-lived cookie (~5 years)
      maxAge: 60 * 60 * 24 * 365 * 5,
    });
  }

  return res;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
