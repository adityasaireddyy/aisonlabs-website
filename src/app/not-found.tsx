import Link from "next/link";
import Button from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container-x flex h-[var(--nav-h)] items-center">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Aison Labs, home">
          <LogoMark size={26} title="" />
          <span className="text-[16px] font-semibold tracking-[-0.02em]">Aison Labs</span>
        </Link>
      </div>
      <div className="container-x flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="eyebrow">404</p>
        <h1 className="h1 mt-3">Page not found.</h1>
        <p className="lead mt-4 max-w-[32rem]">The address may be wrong, or this page no longer exists.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg" arrow>
            Back to home
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </main>
  );
}
