"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Likes({
  tweet,
}: // addOptimisticTweet,
{
  tweet: TweetWithAuthor;
  // addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
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
        // addOptimisticTweet({
        //   ...tweet,
        //   likes: tweet.likes - 1,
        //   user_has_liked_tweet: !tweet.user_has_liked_tweet,
        // });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        // addOptimisticTweet({
        //   ...tweet,
        //   likes: tweet.likes + 1,
        //   user_has_liked_tweet: !tweet.user_has_liked_tweet,
        // });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  return (
    <button className="flex items-center group" onClick={handleLikes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`group-hover:fill-rose-500 group-hover:stroke-rose-500 ${
          tweet.user_has_liked_tweet
            ? "fill-rose-500 stroke-rose-500"
            : "fill-none stroke-neutral-500"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span
        className={`ml-2 text-sm group-hover:text-rose-500 ${
          tweet.user_has_liked_tweet ? "text-rose-500" : "text-neutral-500"
        }`}
      >
        {tweet.likes}
      </span>
    </button>
  );
}
