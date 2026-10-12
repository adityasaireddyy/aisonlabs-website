import { redirect } from "next/navigation";
import { aisonEdu, productHref } from "@/data/products";

/** Aison Edu is the one live product, so the products index goes straight to it. */
export default function ProductsPage() {
  redirect(productHref(aisonEdu));
}
