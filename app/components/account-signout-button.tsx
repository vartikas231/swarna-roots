"use client";

import { signOut } from "next-auth/react";

export function AccountSignOutButton() {
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </button>
  );
}
