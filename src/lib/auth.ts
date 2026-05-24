import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { sendAuthMagicLinkEmail } from "@/src/lib/email";
import { verifyPassword } from "@/src/lib/password";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];
const LOCAL_AUTH_SECRET = "local-dev-only-secret-change-me";
const credentialsSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

function resolveAuthSecret() {
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

export const authOptions: NextAuthOptions = {
  secret: resolveAuthSecret(),
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    EmailProvider({
      from:
        process.env.AUTH_EMAIL_FROM ??
        process.env.ORDER_EMAIL_FROM ??
        "Swarna Roots <onboarding@resend.dev>",
      maxAge: 15 * 60,
      async sendVerificationRequest({ identifier, url }) {
        const result = await sendAuthMagicLinkEmail({
          to: identifier,
          url,
        });
        if (!result.sent && process.env.NODE_ENV === "production") {
          throw new Error(result.error ?? "Failed to send sign-in email.");
        }
      },
    }),
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: parsedCredentials.data.email },
        });

        if (!user || !user.password || !isAdminRole(user.role)) {
          return null;
        }

        const validPassword = verifyPassword(parsedCredentials.data.password, user.password);
        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role as UserRole;
      }

      if ((!token.userId || !token.role) && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email.toLowerCase() },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }

      if (!token.role) {
        token.role = "CUSTOMER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.role = (token.role as UserRole | undefined) ?? "CUSTOMER";
      }
      return session;
    },
  },
};

export function roleCanManageAdmins(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
