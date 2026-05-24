"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

interface CustomerAuthFormProps {
  mode: "login" | "signup";
  callbackUrl?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CustomerAuthForm({ mode, callbackUrl = "/account" }: CustomerAuthFormProps) {
  const { data: session, status } = useSession();
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    setError(null);
    setSuccess(null);

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("email", {
        email: normalizedEmail,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Unable to send the secure link. Please try again.");
        return;
      }

      setSuccess("Secure link sent. Check your inbox to continue.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section-card reveal reveal-delay-1">
        <p className="eyebrow">{isSignup ? "Customer signup" : "Customer login"}</p>
        <h1 className="page-title">
          {isSignup ? "Create your Swarna Roots account" : "Sign in with your email"}
        </h1>
        <p className="page-subtitle">
          {isSignup
            ? "Use your email to create a password-free account for order tracking and faster checkout."
            : "We will send a secure sign-in link to your email. No password needed."}
        </p>
      </section>

      <section className="section-card admin-section reveal reveal-delay-2">
        {status === "loading" ? (
          <p className="auth-note">Checking your session...</p>
        ) : session?.user ? (
          <>
            <p className="form-success">You are signed in as {session.user.email}.</p>
            <Link href="/account" className="btn btn-primary">
              Open account
            </Link>
          </>
        ) : (
          <form className="admin-grid-form" onSubmit={handleSubmit} noValidate>
            <label className="field-span-2">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(error)}
              />
            </label>
            <button type="submit" className="btn btn-primary field-span-2" disabled={isSubmitting}>
              {isSubmitting ? "Sending secure link..." : "Send secure link"}
            </button>
          </form>
        )}

        {error ? <p className="form-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}

        <p className="auth-note">
          {isSignup ? (
            <>
              Already have an account? <Link href="/login">Sign in</Link>.
            </>
          ) : (
            <>
              New customer? <Link href="/signup">Create an account</Link>.
            </>
          )}{" "}
          Admins should use the <Link href="/admin/login">admin login page</Link>.
        </p>
        <Link href="/" className="text-link">
          Back to storefront
        </Link>
      </section>
    </div>
  );
}
