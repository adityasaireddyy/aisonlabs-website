import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/db/content";
import { AdminHeader, Field, FormGrid, Input, Panel } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/client";
import { changePasswordAction, saveSettingsAction } from "../actions";

export default async function AdminSettings() {
  const session = await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <AdminHeader eyebrow="System" title="Settings" description="Site-wide values used by the footer, menus, contact and careers pages." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Site">
          <ActionForm action={saveSettingsAction} submitLabel="Save settings">
            <FormGrid className="md:grid-cols-1">
              <Field label="Site URL" hint="Used for canonical links and the sitemap.">
                <Input name="siteUrl" defaultValue={s.siteUrl} placeholder="https://aisonlabs.com" />
              </Field>
              <Field label="Contact email">
                <Input name="contactEmail" type="email" defaultValue={s.contactEmail} />
              </Field>
              <Field label="Careers email" hint="Falls back to the contact email when empty.">
                <Input name="careersEmail" type="email" defaultValue={s.careersEmail} />
              </Field>
            </FormGrid>
            <FormGrid>
              <Field label="LinkedIn">
                <Input name="linkedin" defaultValue={s.socials.linkedin} placeholder="https://linkedin.com/company/…" />
              </Field>
              <Field label="X">
                <Input name="x" defaultValue={s.socials.x} placeholder="https://x.com/…" />
              </Field>
              <Field label="Instagram">
                <Input name="instagram" defaultValue={s.socials.instagram} />
              </Field>
              <Field label="GitHub">
                <Input name="github" defaultValue={s.socials.github} />
              </Field>
            </FormGrid>
          </ActionForm>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Your account">
            <p className="text-[14px]">{session.name}</p>
            <p className="t-mono mb-6 text-mute">{session.email}</p>
            <ActionForm action={changePasswordAction} submitLabel="Change password">
              <FormGrid className="md:grid-cols-1">
                <Field label="Current password">
                  <Input name="current" type="password" autoComplete="current-password" required />
                </Field>
                <Field label="New password" hint="At least 10 characters.">
                  <Input name="next" type="password" autoComplete="new-password" required minLength={10} />
                </Field>
                <Field label="Confirm new password">
                  <Input name="confirm" type="password" autoComplete="new-password" required minLength={10} />
                </Field>
              </FormGrid>
            </ActionForm>
          </Panel>
          <Panel title="Integrations">
            <dl className="flex flex-col gap-3 text-[13px]">
              <div>
                <dt className="t-mono text-mute">Contact and careers webhook</dt>
                <dd className="mt-1">
                  {process.env.CONTACT_WEBHOOK_URL ? "Configured. Every lead and application is also forwarded." : "Not configured. Set CONTACT_WEBHOOK_URL to forward submissions to email, Slack or another CRM."}
                </dd>
              </div>
              <div>
                <dt className="t-mono text-mute">Database</dt>
                <dd className="mt-1">{process.env.DATABASE_URL?.startsWith("libsql") ? "Hosted libsql" : "Local SQLite file (db/aison.db)"}</dd>
              </div>
              <div>
                <dt className="t-mono text-mute">Auth secret</dt>
                <dd className="mt-1">{process.env.AUTH_SECRET ? "Set" : "Using the development default. Set AUTH_SECRET before deploying."}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}
