import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../prisma";

async function getUser(login: string): Promise<Prisma.UserCreateInput | null> {
  try {
    const user = await prisma.user.findFirst({ where: { login } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z.object({ login: z.string().min(6) }).safeParse(credentials);
        if (parsedCredentials.success) {
          const { login } = parsedCredentials.data;
          const user = await getUser(login);
          if (user) return user;
        }

        console.log("Invalid credentials");
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userData = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userData) {
        session.user = token.userData as any;
      }
      return session;
    }
  }
});
