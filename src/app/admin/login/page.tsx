import type { Metadata } from "next";
import { LogoMark } from "@/components/ui/Logo";
import LoginForm from "./form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-3">
          <LogoMark size={30} accent />
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em]">AISON LABS</p>
            <p className="t-mono text-mute">CMS · CRM</p>
          </div>
        </div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em]">Sign in</h1>
        <p className="t-small mt-2 text-mute">Admin access only. Sessions last seven days.</p>
        <div className="mt-8">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
