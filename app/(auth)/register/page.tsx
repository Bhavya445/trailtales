"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", { method: "POST", body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      toast.error(j.error ?? "Could not create account");
      setLoading(false); return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    toast.success("Account created");
    router.push("/feed");
  }

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-serif text-4xl text-forest">Start your journal</h1>
      <p className="text-muted mt-2">Free, takes 20 seconds.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-white" placeholder="Name"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-white" placeholder="Email" type="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-white" placeholder="Password (min 8 chars)" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})} minLength={8} required />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-forest text-cream hover:bg-forest-deep disabled:opacity-60">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-muted mt-6">
        Already have one? <Link href="/login" className="text-terracotta hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
