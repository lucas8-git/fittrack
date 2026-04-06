/**
 * NextAuth v5 Configuration
 * Credentials provider (email + password) only for MVP.
 * Google OAuth can be added in V2 by adding the Google provider here.
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Validate input shape
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, password: true },
        });

        if (!user?.password) return null;

        // Compare hashed password — NEVER compare plain text
        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // Add user id to JWT token
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    // Expose user id on session
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
