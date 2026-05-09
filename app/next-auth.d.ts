import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/generated/prisma/enums.js";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login: string;
      role: Role;
      is_blocked: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    login: string;
    role: Role;
    is_blocked: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    login: string;
    role: Role;
    is_blocked: boolean;
  }
}
