import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getJobById } from "@/lib/db/content";
import { AdminHeader, Field, FormGrid, Input, LinkButton, Select, Textarea } from "@/components/admin/ui";
import { ActionForm, ConfirmButton, SlugField } from "@/components/admin/client";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { deleteJobAction, saveJobAction } from "../../actions";

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const TEMPLATE = `## What you will do

-
-

## What we are looking for

-
-

## How we work

Small team, real problems, first principles, close to production.

## Process

1. A short conversation.
2. A practical exercise or a look at something you have built.
3. A longer conversation with the team.
`;

export default async function EditJob(props: PageProps<"/admin/careers/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const isNew = id === "new";
  const job = isNew ? null : await getJobById(id);
  if (!isNew && !job) notFound();

  return (
    <>
      <AdminHeader
        eyebrow="Content / Careers"
        title={isNew ? "New role" : job!.title}
        actions={
          <>
            <LinkButton href="/admin/careers">Back</LinkButton>
            {job?.status === "open" && <LinkButton href={`/careers/${job.slug}`}>View ↗</LinkButton>}
          </>
        }
      />
      <ActionForm
        action={saveJobAction}
        submitLabel={isNew ? "Create role" : "Save changes"}
        extra={
          !isNew && (
            <form action={deleteJobAction} className="ml-auto">
              <input type="hidden" name="id" value={job!.id} />
              <ConfirmButton message="Delete this role permanently? Applications are kept.">Delete</ConfirmButton>
            </form>
          )
        }
      >
        {job && <input type="hidden" name="id" value={job.id} />}
        <FormGrid>
          <Field label="Title" className="md:col-span-2">
            <Input name="title" defaultValue={job?.title ?? ""} required autoFocus={isNew} placeholder="Product Engineer" />
          </Field>
          <Field label="Slug">
            <SlugField defaultValue={job?.slug ?? ""} />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={job?.status ?? "draft"} options={[{ value: "draft", label: "Draft" }, { value: "open", label: "Open" }, { value: "closed", label: "Closed" }]} />
          </Field>
          <Field label="Team">
            <Input name="team" defaultValue={job?.team ?? ""} placeholder="Engineering, Product, Design…" />
          </Field>
          <Field label="Location">
            <Input name="location" defaultValue={job?.location ?? ""} placeholder="Hyderabad · Remote (India)" />
          </Field>
          <Field label="Type">
            <Select name="type" defaultValue={job?.type ?? "Full-time"} options={TYPES.map((t) => ({ value: t, label: t }))} />
          </Field>
          <Field label="Applications email" hint="Optional. Overrides the careers email from Settings for this role.">
            <Input name="applyEmail" type="email" defaultValue={job?.applyEmail ?? ""} />
          </Field>
          <Field label="Summary" hint="One or two sentences shown in the list." className="md:col-span-2">
            <Textarea name="summary" rows={2} defaultValue={job?.summary ?? ""} />
          </Field>
        </FormGrid>
        <MarkdownEditor name="content" defaultValue={job?.content ?? TEMPLATE} label="Description" rows={18} />
      </ActionForm>
    </>
  );
}
