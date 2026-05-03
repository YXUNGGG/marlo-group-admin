// I try this to reduce freezing
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AuthModal = dynamic(() => import("@/app/components/auth/auth-modal").then(mod => mod.AuthModal), {
  ssr: false,
  loading: () => null
});

export function AuthModalWrapper() {
  return (
    <Suspense fallback={null}>
      <AuthModal />
    </Suspense>
  );
}
