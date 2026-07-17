"use client";
import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Replace } from "lucide-react";

export default function ImageUpload({ value, onChange, className = "" }: {
  value: string; onChange: (v: string) => void; className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  async function upload(file: File) {
    setBusy(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(data.error || "Upload failed"); return; }
      onChange(data.path);
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-28 w-full object-contain" />
          <button type="button" onClick={() => onChange("")} aria-label="Remove"
            className="absolute right-1.5 top-1.5 rounded-md bg-black/55 p-1 text-white hover:bg-black/75"><X className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-navy shadow-sm hover:bg-white">
            <Replace className="h-3 w-3" /> Replace
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
          className={`flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-xs transition-colors ${drag ? "border-green bg-green/5 text-green" : "border-border text-muted-foreground hover:border-green/50"}`}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          <span>{busy ? "Uploading…" : "Drag an image here, or click to upload"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }} />
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}
