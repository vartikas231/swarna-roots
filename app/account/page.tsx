import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AccountSignOutButton } from "@/app/components/account-signout-button";
import { authOptions } from "@/src/lib/auth";

interface AccountPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? "/account";

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <div className="page-stack">
      <section className="section-card reveal reveal-delay-1">
        <p className="eyebrow">Member account</p>
        <h1 className="page-title">Welcome back, {session.user.name ?? "Customer"}</h1>
        <p className="page-subtitle">
          You are signed in with {session.user.email}. Order history and saved profiles can be added
          here next.
        </p>
      </section>

      <section className="section-card admin-section reveal reveal-delay-2">
        <p className="auth-note">
          Your account is active. Next step we can connect this with reorder reminders, scheduled
          orders, and loyalty credits.
        </p>
        <div className="account-actions">
          <Link href="/shop" className="btn btn-primary">
            Continue shopping
          </Link>
          <AccountSignOutButton />
        </div>
      </section>
    </div>
  );
}
