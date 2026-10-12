"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const INTENTS = ["A custom system for my organization", "Aison Edu for my institution", "A product idea", "Research or collaboration", "Something else"];

type Status = "idle" | "sending" | "sent" | "error";

/** Contact form. Submissions are stored as leads in the CRM. */
export default function ContactForm({ email }: { email?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [intent, setIntent] = useState("");
  const id = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, intent }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
      setIntent("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 md:p-10" role="status" aria-live="polite">
        <p className="eyebrow">Received</p>
        <p className="h2 mt-3">Thanks. We read everything and reply personally.</p>
        {email && (
          <p className="body mt-4 text-mute">
            If it is urgent, write to{" "}
            <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${email}`}>
              {email}
            </a>
            .
          </p>
        )}
        <div className="mt-8">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-6 p-6 md:p-8">
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor={`${id}-name`} required>
          <input id={`${id}-name`} name="name" type="text" required autoComplete="name" className="input" placeholder="Your name" />
        </Field>
        <Field label="Organization" htmlFor={`${id}-org`}>
          <input id={`${id}-org`} name="organization" type="text" autoComplete="organization" className="input" placeholder="Company, institution or team" />
        </Field>
      </div>

      <Field label="Work email" htmlFor={`${id}-email`} required>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="input" placeholder="you@organization.com" />
      </Field>

      <div>
        <p className="mb-2 text-[14px] font-medium" id={`${id}-intent`}>
          What are you looking to build?
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${id}-intent`}>
          {INTENTS.map((opt) => {
            const on = intent === opt;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setIntent(on ? "" : opt)}
                className={cn(
                  "rounded-none border px-4 py-2 text-left text-[14px] font-medium transition-colors duration-200",
                  on ? "border-fg bg-fg text-bg" : "border-line-strong text-fg hover:border-fg",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Message" htmlFor={`${id}-msg`} required>
        <textarea id={`${id}-msg`} name="message" required rows={5} className="input resize-y" placeholder="What are you trying to build, fix or rethink?" />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending" : "Start the conversation"}
        </Button>
        <p className="small text-mute" aria-live="polite" role="status">
          {status === "error" ? <span className="font-medium text-accent">{error}</span> : "We reply to every message."}
        </p>
      </div>
    </form>
  );
}

export function Field({ label, htmlFor, required, children }: { label: string; htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14px] font-medium">
        {label}
        {!required && <span className="ml-1.5 font-normal text-mute">Optional</span>}
      </label>
      {children}
    </div>
  );
}
