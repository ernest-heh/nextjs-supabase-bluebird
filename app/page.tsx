import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/AuthButtonServer";
import NewTweet from "./components/NewTweet";
import TweetFeed from "./components/TweetFeed";
import { getTweets } from "./lib/actions";

const INITIAL_NUMBER_OF_TWEETS = 5;

export default async function Home() {
  // const initialTweets = await getTweets(0, INITIAL_NUMBER_OF_TWEETS - 1);

  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login");
  // }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });
  // .range(0, 5);

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      // check if author is an array, if so, use the first element
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session?.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  // const formatTweetsWithLikeData = async (data) => {};

  return (
    <div className="bg-neutral-900 w-full max-w-lg mx-auto border-x border-neutral-700">
      <div className="flex justify-between items-center px-4 py-6">
        <h1 className="text-lg font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      {session ? (
        <NewTweet user={session.user} />
      ) : (
        <div className="flex justify-center p-3 gap-3 border-t border-neutral-700">
          <AuthButtonServer />
        </div>
      )}
      <TweetFeed tweets={tweets} />
    </div>
  );
}
