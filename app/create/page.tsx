"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { postSchema, type PostInput, TRAVEL_GROUPS, TRANSPORT_MODES, STAY_TYPES } from "@/lib/validations";

const STEPS = ["Basics","Getting there","Stays","Cafes","Photos","Review"];

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "", description: "", destination: "",
      startDate: "", endDate: "", travelGroup: "SOLO",
      transportModes: [], stays: [], cafes: [], photos: []
    },
    mode: "onTouched"
  });

  const transportArr = useFieldArray({ control: form.control, name: "transportModes" });
  const staysArr = useFieldArray({ control: form.control, name: "stays" });
  const cafesArr = useFieldArray({ control: form.control, name: "cafes" });
  const photosArr = useFieldArray({ control: form.control, name: "photos" });

  if (status === "loading") return <div className="container-page py-20 text-muted">Loading…</div>;
  if (!session) {
    return (
      <div className="container-page py-20 max-w-md">
        <h1 className="font-serif text-4xl text-forest">Sign in to share a trip</h1>
        <Link href="/login?callbackUrl=/create" className="inline-block mt-6 px-5 py-3 rounded-xl bg-forest text-cream">Sign in</Link>
      </div>
    );
  }

  async function onSubmit(values: PostInput) {
    setSubmitting(true);
    const res = await fetch("/api/posts", { method: "POST", body: JSON.stringify(values), headers: { "Content-Type": "application/json" } });
    setSubmitting(false);
    if (!res.ok) { const j = await res.json().catch(()=>({})); toast.error(j.error ?? "Could not save"); return; }
    const created = await res.json();
    toast.success("Published");
    router.push(`/post/${created.id}`);
  }

  async function uploadPhoto(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const j = await res.json(); return j.url as string;
  }

  async function next() {
    const fields: Record<number, (keyof PostInput)[]> = {
      0: ["title","description","destination","startDate","endDate","travelGroup"],
      1: ["transportModes"], 2: ["stays"], 3: ["cafes"], 4: ["photos"]
    };
    const ok = await form.trigger(fields[step] as any);
    if (ok) setStep(s => Math.min(s+1, STEPS.length-1));
  }

  return (
    <div className="container-page py-12 max-w-3xl">
      <p className="uppercase tracking-[0.18em] text-terracotta text-xs">New trip</p>
      <h1 className="font-serif text-4xl md:text-5xl text-forest mt-2">Tell your story</h1>

      <ol className="flex flex-wrap gap-2 mt-8">
        {STEPS.map((s,i) => (
          <li key={s} className={`px-3 py-1.5 rounded-full text-xs ${i===step ? "bg-forest text-cream" : i<step ? "bg-terracotta/20 text-terracotta" : "bg-forest/5 text-muted"}`}>
            {i+1}. {s}
          </li>
        ))}
      </ol>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Trip title">
              <input {...form.register("title")} className="input" placeholder="A week in Spiti" />
              <Err msg={form.formState.errors.title?.message} />
            </Field>
            <Field label="Description">
              <textarea {...form.register("description")} rows={5} className="input" placeholder="What was the trip like?" />
              <Err msg={form.formState.errors.description?.message} />
            </Field>
            <Field label="Destination / region">
              <input {...form.register("destination")} className="input" placeholder="Spiti Valley, Himachal Pradesh" />
              <Err msg={form.formState.errors.destination?.message} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Start date"><input type="date" {...form.register("startDate")} className="input" /><Err msg={form.formState.errors.startDate?.message} /></Field>
              <Field label="End date"><input type="date" {...form.register("endDate")} className="input" /><Err msg={form.formState.errors.endDate?.message} /></Field>
            </div>
            <Field label="Who did you travel with?">
              <select {...form.register("travelGroup")} className="input">
                {TRAVEL_GROUPS.map(g => <option key={g} value={g}>{g.replace("_"," ")}</option>)}
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-sm text-muted mb-3">Tick every mode of transport you used. Add notes if you'd like.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {TRANSPORT_MODES.map(m => {
                const idx = transportArr.fields.findIndex((f:any) => f.mode === m);
                const checked = idx !== -1;
                return (
                  <label key={m} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${checked ? "border-forest bg-forest/5" : "border-forest/15 bg-white"}`}>
                    <input type="checkbox" checked={checked} onChange={e => {
                      if (e.target.checked) transportArr.append({ mode: m, details: "" });
                      else transportArr.remove(idx);
                    }} />
                    <span>{m}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-6 space-y-3">
              {transportArr.fields.map((f, i) => (
                <div key={f.id} className="p-4 rounded-xl bg-white border border-forest/10">
                  <div className="text-sm font-medium text-forest">{(f as any).mode}</div>
                  <input {...form.register(`transportModes.${i}.details`)} className="input mt-2" placeholder="Optional details — operator, route, cost…" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <ArraySection title="Add the places you stayed" addLabel="Add a stay"
            onAdd={() => staysArr.append({ name:"", location:"", type:"Hotel", costPerNight: null, rating: null })}
            onRemove={i => staysArr.remove(i)} items={staysArr.fields}
            render={(i) => (
              <>
                <input {...form.register(`stays.${i}.name`)} className="input" placeholder="Place name" />
                <input {...form.register(`stays.${i}.location`)} className="input" placeholder="Location / area" />
                <select {...form.register(`stays.${i}.type`)} className="input">
                  {STAY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <Controller control={form.control} name={`stays.${i}.costPerNight`} render={({field}) =>
                    <input type="number" min={0} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? null : Number(e.target.value))} className="input" placeholder="Cost / night" />
                  } />
                  <Controller control={form.control} name={`stays.${i}.rating`} render={({field}) =>
                    <input type="number" min={0} max={5} step={0.5} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? null : Number(e.target.value))} className="input" placeholder="Rating /5" />
                  } />
                </div>
              </>
            )} />
        )}

        {step === 3 && (
          <ArraySection title="Cafes & restaurants" addLabel="Add a place"
            onAdd={() => cafesArr.append({ name:"", location:"", hadWhat:"", rating: null })}
            onRemove={i => cafesArr.remove(i)} items={cafesArr.fields}
            render={(i) => (
              <>
                <input {...form.register(`cafes.${i}.name`)} className="input" placeholder="Name" />
                <input {...form.register(`cafes.${i}.location`)} className="input" placeholder="Location" />
                <input {...form.register(`cafes.${i}.hadWhat`)} className="input" placeholder="What you had (optional)" />
                <Controller control={form.control} name={`cafes.${i}.rating`} render={({field}) =>
                  <input type="number" min={0} max={5} step={0.5} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === "" ? null : Number(e.target.value))} className="input" placeholder="Rating /5" />
                } />
              </>
            )} />
        )}

        {step === 4 && (
          <div>
            <p className="text-sm text-muted mb-3">Up to 10 photos. Drag a file in or click to choose.</p>
            <label className="block border-2 border-dashed border-forest/20 rounded-xl p-10 text-center cursor-pointer hover:bg-forest/5">
              <input type="file" accept="image/*" multiple className="hidden" onChange={async e => {
                const files = Array.from(e.target.files ?? []);
                for (const file of files) {
                  if (photosArr.fields.length >= 10) { toast.error("Max 10 photos"); break; }
                  try { const url = await uploadPhoto(file); photosArr.append({ url, caption: "" }); }
                  catch { toast.error(`Couldn't upload ${file.name}`); }
                }
                e.target.value = "";
              }} />
              <div className="font-serif text-2xl text-forest">Drop photos here</div>
              <div className="text-sm text-muted mt-1">JPG, PNG up to 10MB each</div>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {photosArr.fields.map((f, i) => (
                <div key={f.id} className="relative group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-forest/5">
                    <Image src={(f as any).url} alt="" fill className="object-cover" sizes="200px" />
                  </div>
                  <input {...form.register(`photos.${i}.caption`)} placeholder="Caption" className="input mt-2 text-xs" />
                  <button type="button" onClick={() => photosArr.remove(i)} className="absolute top-2 right-2 bg-cream/90 text-terracotta text-xs px-2 py-1 rounded">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-forest">Review</h2>
            <pre className="text-xs bg-white p-4 rounded-xl border border-forest/10 overflow-auto whitespace-pre-wrap">{JSON.stringify(form.getValues(), null, 2)}</pre>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-forest/10">
          <button type="button" disabled={step===0} onClick={() => setStep(s => Math.max(0, s-1))}
            className="px-4 py-2.5 rounded-xl border border-forest/15 disabled:opacity-40">Back</button>
          {step < STEPS.length-1 ? (
            <button type="button" onClick={next} className="px-5 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-deep">Continue</button>
          ) : (
            <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-terracotta text-cream hover:bg-terracotta-soft disabled:opacity-60">
              {submitting ? "Publishing…" : "Publish trip"}
            </button>
          )}
        </div>
      </form>

      <style jsx global>{`
        .input { width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid rgba(28,58,42,0.15); background: #fff; }
        .input:focus { outline: none; border-color: #1C3A2A; box-shadow: 0 0 0 3px rgba(28,58,42,0.08); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm text-ink mb-1.5 block">{label}</span>{children}</label>;
}
function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-terracotta mt-1">{msg}</p> : null;
}
function ArraySection({ title, addLabel, onAdd, onRemove, items, render }:
  { title: string; addLabel: string; onAdd: ()=>void; onRemove: (i:number)=>void; items: any[]; render: (i:number)=>React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-serif text-2xl text-forest">{title}</h2>
        <button type="button" onClick={onAdd} className="text-sm px-3 py-1.5 rounded-lg border border-forest/15 hover:bg-forest/5">+ {addLabel}</button>
      </div>
      {items.length === 0 && <p className="text-muted text-sm">None added yet. Skip if you'd like.</p>}
      <div className="space-y-4">
        {items.map((f, i) => (
          <div key={f.id} className="p-4 rounded-xl bg-white border border-forest/10 space-y-2">
            {render(i)}
            <button type="button" onClick={() => onRemove(i)} className="text-xs text-terracotta hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
