import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPostById } from "@/lib/db/content";
import { AdminHeader, Field, FormGrid, Input, LinkButton, Select, Textarea } from "@/components/admin/ui";
import { ActionForm, ConfirmButton, SlugField } from "@/components/admin/client";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { deletePostAction, savePostAction } from "../../actions";

export default async function EditPost(props: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const isNew = id === "new";
  const post = isNew ? null : await getPostById(id);
  if (!isNew && !post) notFound();

  const date = post?.publishedAt ? post.publishedAt.slice(0, 10) : "";

  return (
    <>
      <AdminHeader
        eyebrow="Content / Blog"
        title={isNew ? "New post" : post!.title}
        actions={
          <>
            <LinkButton href="/admin/blog">Back</LinkButton>
            {post?.status === "published" && <LinkButton href={`/blog/${post.slug}`}>View ↗</LinkButton>}
          </>
        }
      />
      <ActionForm
        action={savePostAction}
        submitLabel={isNew ? "Create post" : "Save changes"}
        extra={
          !isNew && (
            <form action={deletePostAction} className="ml-auto">
              <input type="hidden" name="id" value={post!.id} />
              <ConfirmButton message="Delete this post permanently?">Delete</ConfirmButton>
            </form>
          )
        }
      >
        {post && <input type="hidden" name="id" value={post.id} />}
        <FormGrid>
          <Field label="Title" className="md:col-span-2">
            <Input name="title" defaultValue={post?.title ?? ""} required autoFocus={isNew} />
          </Field>
          <Field label="Slug" hint="URL path under /blog/. Generated from the title until you edit it.">
            <SlugField defaultValue={post?.slug ?? ""} />
          </Field>
          <Field label="Category">
            <Input name="category" defaultValue={post?.category ?? ""} placeholder="Building, Engineering, Company…" />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={post?.status ?? "draft"} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
          </Field>
          <Field label="Publish date" hint="Leave empty to use the moment it is first published.">
            <Input name="publishedAt" type="date" defaultValue={date} />
          </Field>
          <Field label="Author">
            <Input name="author" defaultValue={post?.author ?? "Aison Labs"} />
          </Field>
          <Field label="Tags" hint="Comma separated.">
            <Input name="tags" defaultValue={post?.tags.join(", ") ?? ""} placeholder="edu, architecture" />
          </Field>
          <Field label="Cover image URL" hint="Optional. Any public image URL." className="md:col-span-2">
            <Input name="coverUrl" defaultValue={post?.coverUrl ?? ""} placeholder="https://…" />
          </Field>
          <Field label="Excerpt" hint="One or two sentences shown in lists and search results." className="md:col-span-2">
            <Textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} />
          </Field>
        </FormGrid>
        <MarkdownEditor name="content" defaultValue={post?.content ?? ""} />
      </ActionForm>
    </>
  );
}
