import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/src/lib/db";
import { sendAuthMagicLinkEmail } from "@/src/lib/email";
import { verifyPassword } from "@/src/lib/password";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "local-dev-only-secret-change-me",
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
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
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password || !isAdminRole(user.role)) {
          return null;
        }

        const validPassword = verifyPassword(password, user.password);
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
