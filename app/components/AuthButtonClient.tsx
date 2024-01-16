"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      className="text-xs px-3 py-1 bg-neutral-700 rounded-full hover:opacity-60 transition-opacity"
      onClick={handleSignOut}
    >
      Logout
    </button>
  ) : (
    <button
      className="text-xs px-3 py-1 bg-neutral-700 rounded-full hover:opacity-60 transition-opacity"
      onClick={handleSignIn}
    >
      Login with Github
    </button>
  );
}
