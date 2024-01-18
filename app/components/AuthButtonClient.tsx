"use client";

import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/supabase-client";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createSupabaseBrowserClient();

  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <button
      className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:opacity-60 transition-opacity"
      onClick={handleSignOut}
    >
      Logout
    </button>
  ) : (
    <button
      className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:opacity-60 transition-opacity"
      onClick={handleSignIn}
    >
      Login with Github
    </button>
  );
}
