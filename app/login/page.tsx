"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/account", [searchParams]);
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("email", {
        email: email.trim().toLowerCase(),
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Unable to send sign-in link. Please try again.");
        return;
      }

      setSuccess("Sign-in link sent. Please check your inbox.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section-card reveal reveal-delay-1">
        <p className="eyebrow">Customer login</p>
        <h1 className="page-title">Sign in with your email</h1>
        <p className="page-subtitle">
          We&apos;ll send a secure sign-in link to your email. No password needed.
        </p>
      </section>

      <section className="section-card admin-section reveal reveal-delay-2">
        {session?.user ? (
          <>
            <p className="form-success">You are already signed in as {session.user.email}.</p>
            <Link href="/account" className="btn btn-primary">
              Open account
            </Link>
          </>
        ) : (
          <form className="admin-grid-form" onSubmit={handleSubmit}>
            <label className="field-span-2">
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <button type="submit" className="btn btn-primary field-span-2" disabled={isSubmitting}>
              {isSubmitting ? "Sending link..." : "Send secure login link"}
            </button>
          </form>
        )}

        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}

        <p className="auth-note">
          Admins should use the <Link href="/admin/login">admin login page</Link>.
        </p>
        <Link href="/" className="text-link">
          Back to storefront
        </Link>
      </section>
    </div>
  );
}
