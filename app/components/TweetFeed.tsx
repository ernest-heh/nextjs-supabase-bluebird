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
    <div className="flex gap-3 p-3 border-t border-neutral-700" key={tweet.id}>
      <div className="">
        <Image
          alt="avatar"
          src={tweet.author.avatar_url}
          className="rounded-full"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <p className="flex gap-2 items-end text-[0.9em]">
          <span className="font-bold">{tweet.author.name}</span>{" "}
          <span className="text-neutral-500">@{tweet.author.username}</span>
        </p>
        <p className="whitespace-pre-line">{tweet?.title}</p>
        <Likes tweet={tweet} />
      </div>
    </div>
  ));
}
