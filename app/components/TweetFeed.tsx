"use client";

import { createBrowserClient } from "@supabase/ssr";
import Likes from "./Likes";
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  }, [supabase, router]);

  return tweets.map((tweet) => (
    <div className="border p-4" key={tweet.id}>
      <div className="flex items-center gap-4">
        <Image
          alt="avatar"
          src={tweet.author.avatar_url}
          className="rounded-full"
          width={40}
          height={40}
        />
        <p className="text-sm text-neutral-400">
          {tweet.author.name} {tweet.author.username}
        </p>
      </div>
      <p className="whitespace-pre-line my-4">{tweet?.title}</p>
      <Likes tweet={tweet} />
    </div>
  ));
}
