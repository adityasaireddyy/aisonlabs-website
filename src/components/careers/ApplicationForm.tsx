"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Field } from "@/components/forms/ContactForm";

type Props = { jobId?: string | null; jobTitle: string; email?: string };
type Status = "idle" | "sending" | "sent" | "error";

/** Application form. Links instead of uploads; stored in the CRM. */
export default function ApplicationForm({ jobId, jobTitle, email }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, jobId: jobId ?? "", jobTitle }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 md:p-10" role="status" aria-live="polite">
        <p className="eyebrow">Received</p>
        <p className="h2 mt-3">Thanks. We read every application ourselves.</p>
        <p className="body mt-4 text-mute">We will reply by email either way.</p>
        <div className="mt-8">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Send another
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
        <Field label="Email" htmlFor={`${id}-email`} required>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="input" placeholder="you@example.com" />
        </Field>
        <Field label="Phone" htmlFor={`${id}-phone`}>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className="input" placeholder="+91" />
        </Field>
        <Field label="Links" htmlFor={`${id}-links`}>
          <input id={`${id}-links`} name="links" type="text" className="input" placeholder="Portfolio, GitHub, CV link" />
        </Field>
      </div>
      <Field label="Why this, why you" htmlFor={`${id}-msg`} required>
        <textarea id={`${id}-msg`} name="message" required rows={5} className="input resize-y" placeholder="A few honest lines. No cover-letter formula needed." />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending" : "Submit application"}
        </Button>
        <p className="small text-mute" aria-live="polite" role="status">
          {status === "error" ? (
            <span className="font-medium text-accent">{error}</span>
          ) : email ? (
            <>
              Or email{" "}
              <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${email}`}>
                {email}
              </a>
            </>
          ) : (
            "We reply to every application."
          )}
        </p>
      </div>
    </form>
  );
}
