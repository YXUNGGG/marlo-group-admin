import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import { Role, User } from "@prisma/client";
import { prisma } from "../prisma";

async function getUser(login: string): Promise<User | null> {
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

          if (user) {
            if (user?.is_blocked) {
              console.log("user was blocked");
              throw new Error("user_blocked");
            } else return user;
          }
        }

        console.log("Invalid credentials");
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.login = user.login;
        token.role = user.role;
        token.is_blocked = user.is_blocked;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          login: token.login as string,
          role: token.role as Role,
          is_blocked: token.is_blocked as boolean
        };
      }
      return session;
    }
  }
});
