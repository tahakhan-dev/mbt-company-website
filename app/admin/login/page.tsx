"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";
import { AdminButton, AdminInput, AdminLabel } from "@/components/admin/ui";
import { Wordmark } from "@/components/marketing/Wordmark";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const auth = clientAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      // The client SDK's own session is not used after this point.
      await signOut(auth).catch(() => {});
      if (!res.ok) throw new Error("exchange failed");
      const from = params.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      // Generic error + slight delay: no account/password oracle.
      await new Promise((r) => setTimeout(r, 600));
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <AdminLabel htmlFor="email">Email</AdminLabel>
        <AdminInput
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <AdminLabel htmlFor="password">Password</AdminLabel>
        <AdminInput
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {state === "error" && (
        <p className="rounded-lg bg-[#3a1420]/60 px-3 py-2 text-sm text-[#ff9d9d]" role="alert">
          Sign-in failed. Check your credentials and try again.
        </p>
      )}
      <AdminButton type="submit" variant="primary" className="w-full" disabled={state === "busy"}>
        {state === "busy" ? "Signing in…" : "Sign in"}
      </AdminButton>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-void px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Wordmark name="Admin" asLink={false} />
          <p className="text-sm text-ink-faint">Sign in to manage the site</p>
        </div>
        <div className="rounded-2xl bg-surface p-6 ring-1 ring-white/10">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-ink-faint">
          Single-admin system · sessions expire after 14 days
        </p>
      </div>
    </main>
  );
}
