"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { SubmitButton } from "@/components/admin/client";
import { Field, Input } from "@/components/admin/ui";

export default function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(loginAction, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Email">
        <Input name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state?.error && (
        <p role="alert" className="t-mono text-accent">
          {state.error}
        </p>
      )}
      <SubmitButton pendingText="Signing in" className="h-11 justify-center">
        Sign in
      </SubmitButton>
    </form>
  );
}
