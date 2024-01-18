"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/supabase-client";
import { cn } from "../lib/utils";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export default function Likes({
  tweet,
}: // addOptimisticTweet,
{
  tweet: TweetWithAuthor;
  // addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();

  const handleLikes = async () => {
    const supabase = createSupabaseBrowserClient();

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
    <button
      className="flex items-center group self-start p-1 -m-1"
      onClick={handleLikes}
    >
      <div className="rounded-full aspect-square p-2 -ms-2 group-hover:text-like group-hover:bg-like/20 transition duration-100 ">
        {tweet.user_has_liked_tweet ? (
          <AiFillHeart
            size={20}
            className="text-like animate-in fade-in-50 zoom-in-150 duration-200"
          />
        ) : (
          <AiOutlineHeart size={20} />
        )}
      </div>
      {tweet.user_has_liked_tweet}
      <span
        className={cn(
          "group-hover:text-like text-sm transition duration-100",
          tweet.user_has_liked_tweet &&
            "text-like animate-in fade-in-0 slide-in-from-top duration-200"
        )}
      >
        {tweet.likes}
      </span>
    </button>
  );
}
