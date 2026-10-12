import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getClientById } from "@/lib/db/content";
import { AdminHeader, Field, FormGrid, Input, LinkButton, Select, Textarea } from "@/components/admin/ui";
import { ActionForm, ConfirmButton, SlugField } from "@/components/admin/client";
import { deleteClientAction, saveClientAction } from "../../actions";

export default async function EditClient(props: PageProps<"/admin/clients/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const isNew = id === "new";
  const client = isNew ? null : await getClientById(id);
  if (!isNew && !client) notFound();

  return (
    <>
      <AdminHeader
        eyebrow="Content / Clients"
        title={isNew ? "Add client" : client!.name}
        description="Only add what is real and approved. Case-study fields stay empty until a write-up exists; the site shows “Case study soon”."
        actions={<LinkButton href="/admin/clients">Back</LinkButton>}
      />
      <ActionForm
        action={saveClientAction}
        submitLabel={isNew ? "Add client" : "Save changes"}
        extra={
          !isNew && (
            <form action={deleteClientAction} className="ml-auto">
              <input type="hidden" name="id" value={client!.id} />
              <ConfirmButton message="Remove this client from the site?">Delete</ConfirmButton>
            </form>
          )
        }
      >
        {client && <input type="hidden" name="id" value={client.id} />}
        <FormGrid>
          <Field label="Name" className="md:col-span-2">
            <Input name="name" defaultValue={client?.name ?? ""} required autoFocus={isNew} />
          </Field>
          <Field label="Slug">
            <SlugField titleName="name" defaultValue={client?.slug ?? ""} />
          </Field>
          <Field label="Kind">
            <Select
              name="kind"
              defaultValue={client?.kind ?? "service"}
              options={[
                { value: "service", label: "Service client" },
                { value: "product-deployment", label: "Product deployment" },
              ]}
            />
          </Field>
          <Field label="Product" hint="For deployments, e.g. Aison Edu.">
            <Input name="product" defaultValue={client?.product ?? ""} />
          </Field>
          <Field label="Descriptor" hint="Short neutral label shown under the name. Optional.">
            <Input name="descriptor" defaultValue={client?.descriptor ?? ""} />
          </Field>
          <Field label="Sort order">
            <Input name="sortOrder" type="number" defaultValue={client?.sortOrder ?? 0} />
          </Field>
          <Field label="Glyph seed" hint="Any number. Changes the abstract preview pattern. Leave blank to pick one.">
            <Input name="seed" type="number" defaultValue={client?.seed ?? ""} />
          </Field>
          <Field label="Case study summary" className="md:col-span-2">
            <Textarea name="caseSummary" rows={3} defaultValue={client?.caseSummary ?? ""} />
          </Field>
          <Field label="Case study scope" hint="One item per line." className="md:col-span-2">
            <Textarea name="caseScope" rows={4} defaultValue={client?.caseScope.join("\n") ?? ""} />
          </Field>
          <Field label="Case study link" hint="When set, the client row links here." className="md:col-span-2">
            <Input name="caseHref" defaultValue={client?.caseHref ?? ""} placeholder="/blog/… or https://…" />
          </Field>
        </FormGrid>
      </ActionForm>
    </>
  );
}
