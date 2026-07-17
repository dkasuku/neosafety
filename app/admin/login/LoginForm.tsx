"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>;
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(login, undefined);
  return (
    <form action={formAction} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-float">
      <div className="mb-6 flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="NEO Safety Supplies" className="h-12 w-auto" />
        <p className="mt-3 text-sm text-muted-foreground">Sign in to manage the store</p>
      </div>
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoFocus required placeholder="Enter admin password" />
      </div>
      {state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
      <div className="mt-6"><SubmitBtn /></div>
    </form>
  );
}
