"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/* Interactive admin primitives. */

export function SubmitButton({ children, pendingText = "Saving", className, primary = true }: { children: ReactNode; pendingText?: string; className?: string; primary?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "t-mono inline-flex h-10 items-center gap-2 border px-4 transition-colors duration-300 disabled:opacity-60",
        primary ? "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg" : "border-line-strong text-fg hover:border-fg",
        className,
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}

/** Submit button that asks for confirmation first (used for deletes). */
export function ConfirmButton({ children, message = "Delete this permanently?", className }: { children: ReactNode; message?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn("t-mono inline-flex h-10 items-center border border-line px-4 text-mute transition-colors hover:border-accent hover:text-accent disabled:opacity-60", className)}
    >
      {pending ? "Working" : children}
    </button>
  );
}

/** Form bound to a server action with { error, ok, message } state. */
export function ActionForm({
  action,
  children,
  className,
  submitLabel = "Save",
  extra,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  submitLabel?: string;
  extra?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form action={formAction} className="flex flex-col gap-6" data-action-form>
        {children}
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <SubmitButton>{submitLabel}</SubmitButton>
          {state?.error && (
            <span role="alert" className="t-mono text-accent">
              {state.error}
            </span>
          )}
          {state?.ok && (
            <span role="status" className="t-mono text-emerald-400">
              {state.message ?? "Saved."}
            </span>
          )}
        </div>
      </form>
      {/* Secondary forms (e.g. delete) render as siblings: forms cannot nest. */}
      {extra && <div className="flex justify-end">{extra}</div>}
    </div>
  );
}

/** Slug input that follows the title until edited by hand. */
export function SlugField({ titleName = "title", name = "slug", defaultValue = "", locked = false }: { titleName?: string; name?: string; defaultValue?: string; locked?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const touched = useRef(Boolean(defaultValue) || locked);
  useEffect(() => {
    if (touched.current) return;
    const title = document.querySelector<HTMLInputElement>(`input[name='${titleName}']`);
    if (!title) return;
    const onInput = () => {
      if (!touched.current) setValue(slugify(title.value));
    };
    title.addEventListener("input", onInput);
    return () => title.removeEventListener("input", onInput);
  }, [titleName]);
  return (
    <input
      name={name}
      value={value}
      onChange={(e) => {
        touched.current = true;
        setValue(slugify(e.target.value) || e.target.value);
      }}
      className="admin-input font-mono text-[13px]"
      placeholder="auto-generated-from-title"
    />
  );
}

export function StatusForm({ action, id, current, options }: { action: (fd: FormData) => Promise<void>; id: string; current: string; options: readonly string[] }) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={current} className="admin-input h-10 w-auto py-0 text-[13px]">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <SubmitButton primary={false} pendingText="Updating">
        Update
      </SubmitButton>
    </form>
  );
}
