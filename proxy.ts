import { withAuth } from "next-auth/middleware";

const LOCAL_AUTH_SECRET = "local-dev-only-secret-change-me";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

function resolveMiddlewareSecret() {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }

  const isProductionRuntime =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build";

  if (isProductionRuntime) {
    throw new Error("NEXTAUTH_SECRET must be set in production.");
  }

  return LOCAL_AUTH_SECRET;
}

export default withAuth(
  () => {},
  {
    secret: resolveMiddlewareSecret(),
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (isPublicAdminPath(pathname)) {
          return true;
        }

        const role = token?.role;
        return role === "ADMIN" || role === "SUPER_ADMIN";
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
