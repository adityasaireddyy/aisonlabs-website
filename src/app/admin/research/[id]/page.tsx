import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getArticleById, nextArticleNumber } from "@/lib/db/content";
import { researchCategories } from "@/data/research";
import { AdminHeader, Field, FormGrid, Input, LinkButton, Select, Textarea } from "@/components/admin/ui";
import { ActionForm, ConfirmButton, SlugField } from "@/components/admin/client";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { deleteArticleAction, saveArticleAction } from "../../actions";

export default async function EditArticle(props: PageProps<"/admin/research/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const isNew = id === "new";
  const article = isNew ? null : await getArticleById(id);
  if (!isNew && !article) notFound();
  const number = article?.number ?? (await nextArticleNumber());
  const date = article?.publishedAt ? article.publishedAt.slice(0, 10) : "";

  return (
    <>
      <AdminHeader
        eyebrow="Content / Research"
        title={isNew ? "New article" : article!.title}
        actions={
          <>
            <LinkButton href="/admin/research">Back</LinkButton>
            {article?.status === "published" && <LinkButton href={`/research/${article.slug}`}>View ↗</LinkButton>}
          </>
        }
      />
      <ActionForm
        action={saveArticleAction}
        submitLabel={isNew ? "Create article" : "Save changes"}
        extra={
          !isNew && (
            <form action={deleteArticleAction} className="ml-auto">
              <input type="hidden" name="id" value={article!.id} />
              <ConfirmButton message="Delete this article permanently?">Delete</ConfirmButton>
            </form>
          )
        }
      >
        {article && <input type="hidden" name="id" value={article.id} />}
        <FormGrid>
          <Field label="Title" className="md:col-span-2">
            <Input name="title" defaultValue={article?.title ?? ""} required autoFocus={isNew} />
          </Field>
          <Field label="Slug">
            <SlugField defaultValue={article?.slug ?? ""} />
          </Field>
          <Field label="Number" hint="Issue-style identifier shown on the card.">
            <Input name="number" defaultValue={number} className="font-mono" />
          </Field>
          <Field label="Category">
            <Select name="category" defaultValue={article?.category ?? researchCategories[0]} options={researchCategories.map((c) => ({ value: c, label: c }))} />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={article?.status ?? "draft"} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
          </Field>
          <Field label="Publish date">
            <Input name="publishedAt" type="date" defaultValue={date} />
          </Field>
          <Field label="Dek" hint="The standfirst under the title." className="md:col-span-2">
            <Textarea name="dek" rows={2} defaultValue={article?.dek ?? ""} />
          </Field>
        </FormGrid>
        <MarkdownEditor name="content" defaultValue={article?.content ?? ""} />
      </ActionForm>
    </>
  );
}
