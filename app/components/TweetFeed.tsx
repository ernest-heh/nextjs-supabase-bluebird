"use client";

import { createBrowserClient } from "@supabase/ssr";
import Likes from "./Likes";
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";

export default function TweetFeed({ tweets }: { tweets: TweetWithAuthor[] }) {
  // const [optimisticTweets, addOptimisticTweet] = useOptimistic<
  //   TweetWithAuthor[],
  //   TweetWithAuthor
  // >(tweets, (currentOptimisticTweets, newTweet) => {
  //   const newOptimisticTweets = [...currentOptimisticTweets];
  //   const index = newOptimisticTweets.findIndex(
  //     (tweet) => tweet.id === newTweet.id
  //   );
  //   newOptimisticTweets[index] = newTweet;
  //   return newOptimisticTweets;
  // });

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return tweets.map((tweet) => (
    <div className="border p-4" key={tweet.id}>
      <p className="text-sm text-neutral-400">
        {tweet.author.name} {tweet.author.username}
      </p>
      <p className="my-4">{tweet?.title}</p>
      <Likes tweet={tweet} />
    </div>
  ));
}
