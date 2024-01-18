"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/supabase-client";
import Tweet from "./Tweet";

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

  // const [offset, setOffset] = useState(NUMBER_OF_TWEETS_TO_LOAD + 1);
  // const [limit, setLimit] = useState(10);
  // const [tweetsArray, setTweetsArray] = useState<TweetWithAuthor[]>(tweets);

  // const loadMoreTweets = async () => {
  //   const dataTweets = await fetchTweets(offset, limit);
  //   setTweetsArray([...tweetsArray, ...dataTweets]);
  //   setLimit(limit + NUMBER_OF_TWEETS_TO_LOAD);
  //   setOffset(offset + NUMBER_OF_TWEETS_TO_LOAD);
  // };

  const supabase = createSupabaseBrowserClient();
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

  return (
    <div className="">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      <div className="flex justify-center">
        {/* <button
          onClick={loadMoreTweets}
          className="py-1 px-3 m-4 rounded-full border border-neutral-200 dark:border-white/20"
        >
          Load More
        </button> */}
      </div>
    </div>
  );
}
