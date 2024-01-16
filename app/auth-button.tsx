"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <button onClick={handleSignIn}>Login</button>
      <button onClick={handleSignOut}>Logout</button>
    </>
  );
}
