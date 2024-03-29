"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import useInView from "../hooks/useInView";
import { fetchTweets } from "../lib/actions";
import { createSupabaseBrowserClient } from "../lib/supabase/supabase-client";
import Tweet from "./Tweet";

const MAX_NUMBER_OF_TWEETS = 10;

export default function LoadMoreTweetsFromUser({ id }: { id: string }) {
  const container = useRef<HTMLDivElement | null>(null);
  const { isInView } = useInView(container);
  const [tweetData, setTweetData] = useState<TweetWithAuthor[]>([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [page, setPage] = useState(1);

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const getFromAndTo = useCallback(() => {
    let from = page * MAX_NUMBER_OF_TWEETS;
    let to = from + MAX_NUMBER_OF_TWEETS;

    if (page > 0) {
      from++;
    }

    return { from, to };
  }, [page]);

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
      const { from, to } = getFromAndTo();
      fetchTweets({ offset: from, limit: to, id }).then((data) => {
        // console.log(
        //   `Length: ${tweetData.length} offset: ${offset} limit: ${limit}`
        // );
        if (data.length === 0) {
          setHasMoreTweets(false);
        } else {
          setTweetData((prevData) => [...prevData, ...data]);
          setPage(page + 1);
        }
      });
    }
  }, [
    isInView,
    getFromAndTo,
    page,
    tweetData.length,
    hasMoreTweets,
    router,
    id,
  ]);

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
