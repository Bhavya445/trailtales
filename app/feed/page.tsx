"use client";
import useSWR from "swr";
import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function FeedPage() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [mode, setMode] = useState("");
  const qs = new URLSearchParams({ ...(q && {q}), ...(group && {group}), ...(mode && {mode}) }).toString();
  const { data, isLoading } = useSWR(`/api/posts?${qs}`, fetcher, { revalidateOnFocus: false });

  return (
    <section className="container-page py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="uppercase tracking-[0.18em] text-terracotta text-xs">The feed</p>
          <h1 className="font-serif text-4xl md:text-5xl text-forest mt-2">Stories from the road</h1>
        </div>
        <Link href="/create" className="px-4 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-deep">Write a trip</Link>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-10">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title or destination"
          className="md:col-span-2 px-4 py-3 rounded-xl border border-forest/15 bg-white" />
        <select value={group} onChange={e=>setGroup(e.target.value)} className="px-4 py-3 rounded-xl border border-forest/15 bg-white">
          <option value="">All groups</option>
          <option value="SOLO">Solo</option><option value="FAMILY">Family</option>
          <option value="PARTNER">Partner</option><option value="FRIENDS">Friends</option>
          <option value="GROUP_TOUR">Group tour</option>
        </select>
        <select value={mode} onChange={e=>setMode(e.target.value)} className="px-4 py-3 rounded-xl border border-forest/15 bg-white">
          <option value="">Any transport</option>
          {["Bus","Train","Car","Bike/Motorcycle","Flight","Taxi/Cab","Auto","Other"].map(m =>
            <option key={m} value={m}>{m}</option>
          )}
        </select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="rounded-xl overflow-hidden bg-white shadow-card animate-pulse">
              <div className="aspect-[4/3] bg-forest/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-forest/10 rounded w-1/3" />
                <div className="h-5 bg-forest/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length ? (
        <div className="grid md:grid-cols-3 gap-6">
          {data.map((p: any) => <PostCard key={p.id} post={p} />)}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-forest/20 rounded-2xl">
          <div className="font-serif text-6xl text-forest/30 mb-4">~</div>
          <h2 className="font-serif text-3xl text-forest">The feed is quiet</h2>
          <p className="text-muted mt-2 max-w-md mx-auto">Be the first to share a trip. Your notes might be exactly what someone planning their next escape needs.</p>
          <Link href="/create" className="inline-block mt-6 px-5 py-3 rounded-xl bg-forest text-cream hover:bg-forest-deep">Write the first one</Link>
        </div>
      )}
    </section>
  );
}
