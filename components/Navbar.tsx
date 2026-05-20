"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="border-b border-forest/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
      <div className="container-page h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl text-forest tracking-tight">TrailTales</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/feed" className="text-ink hover:text-forest">Feed</Link>
          <Link href="/create" className="text-ink hover:text-forest">Write</Link>
          {session ? (
            <>
              <span className="text-muted hidden sm:inline">Hi, {session.user?.name?.split(" ")[0] ?? "traveler"}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-terracotta hover:underline">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="px-3 py-1.5 rounded-lg bg-forest text-cream hover:bg-forest-deep">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
