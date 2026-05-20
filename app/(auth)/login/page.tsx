"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/feed";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) toast.error("Invalid email or password");
    else { toast.success("Welcome back"); router.push(callbackUrl); }
  }

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-serif text-4xl text-forest">Welcome back</h1>
      <p className="text-muted mt-2">Sign in to share a trip.</p>

      <button onClick={() => signIn("google", { callbackUrl })}
        className="mt-8 w-full py-3 rounded-xl border border-forest/20 hover:bg-forest/5 transition">
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <div className="flex-1 h-px bg-forest/10" /> or <div className="flex-1 h-px bg-forest/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-white" placeholder="Email"
          type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-white" placeholder="Password"
          type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-forest text-cream hover:bg-forest-deep disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        No account yet? <Link href="/register" className="text-terracotta hover:underline">Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}