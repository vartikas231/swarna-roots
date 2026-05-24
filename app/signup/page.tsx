import { CustomerAuthForm } from "@/app/components/customer-auth-form";

interface SignupPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <CustomerAuthForm
      mode="signup"
      callbackUrl={resolvedSearchParams?.callbackUrl ?? "/account"}
    />
  );
}
