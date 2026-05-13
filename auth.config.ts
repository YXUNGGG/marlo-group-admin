import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");

      if (isOnDashboard && !isLoggedIn) {
        return false;
      }

      return true;
    }
  },
  providers: [Credentials({})]
} satisfies NextAuthConfig;
