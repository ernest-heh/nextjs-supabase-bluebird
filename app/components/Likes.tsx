"use client";

import { createBrowserClient } from "@supabase/ssr";
import { create } from "domain";
import { useRouter } from "next/navigation";

export default function Likes({ tweet }) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (tweet.user_has_liked_tweet) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  return <button onClick={handleLikes}>{tweet.likes} Likes</button>;
}
