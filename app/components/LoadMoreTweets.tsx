"use client";

import { useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import useInView from "../hooks/useInView";
import { fetchTweets } from "../lib/actions";
import Tweet from "./Tweet";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const INITIAL_NUMBER_OF_TWEETS = 10;

export default function LoadMoreTweets() {
  const container = useRef<HTMLDivElement | null>(null);
  const { isInView } = useInView(container);
  const [tweetData, setTweetData] = useState<TweetWithAuthor[]>([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);

  const offset = tweetData.length + INITIAL_NUMBER_OF_TWEETS;
  const limit = offset + INITIAL_NUMBER_OF_TWEETS - 1;

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

  useEffect(() => {
    if (isInView && hasMoreTweets) {
      fetchTweets({ offset, limit }).then((data) => {
        // console.log(
        //   `Length: ${tweetData.length} offset: ${offset} limit: ${limit}`
        // );
        if (data.length === 0) {
          setHasMoreTweets(false);
        } else {
          setTweetData((prevData) => [...prevData, ...data]);
        }
      });
    }
  }, [isInView, offset, limit, tweetData.length, hasMoreTweets]);

  return (
    <div>
      {tweetData.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}

      <div ref={container} className="flex justify-center py-10">
        {!hasMoreTweets ? (
          <div className="text-sm opacity-50">No More Tweets</div>
        ) : (
          <PulseLoader
            color={"#444"}
            loading={true}
            size={10}
            aria-label="Loading Spinner"
          />
        )}
      </div>
    </div>
  );
}