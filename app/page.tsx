import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/AuthButtonServer";
import TweetFeed from "./components/TweetFeed";
import NewTweet from "./components/NewTweet";
import { fetchTweets } from "./lib/actions";
import SideNav from "./components/SideNav";
import RightSideBar from "./components/RightSideBar";
import { getDbOnServer } from "./lib/supabase";
import Tweet from "./components/Tweet";
import LoadMoreTweets from "./components/LoadMoreTweets";

const INITIAL_NUMBER_OF_TWEETS = 10;

export default async function Home() {
  // const initialTweets = await getTweets(0, INITIAL_NUMBER_OF_TWEETS - 1);

  // const cookieStore = cookies();

  // const supabase = createServerClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return cookieStore.get(name)?.value;
  //       },
  //     },
  //   }
  // );

  const supabase = await getDbOnServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login");
  // }

  // const { data } = await supabase
  //   .from("tweets")
  //   .select("*, author: profiles(*), likes(user_id)")
  //   .order("created_at", { ascending: false });
  // // .range(0, 5);

  // const tweets =
  //   data?.map((tweet) => ({
  //     ...tweet,
  //     // check if author is an array, if so, use the first element
  //     author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
  //     user_has_liked_tweet: !!tweet.likes.find(
  //       (like) => like.user_id === session?.user.id
  //     ),
  //     likes: tweet.likes.length,
  //   })) ?? [];

  const tweets = await fetchTweets({
    offset: 0,
    limit: INITIAL_NUMBER_OF_TWEETS - 1,
  });

  return (
    <>
      <SideNav />

      <main className="w-full max-w-[600px] h-full min-h-screen border-x border-neutral-200 dark:border-white/20">
        <div className="flex justify-between items-center px-4 py-6">
          <h1 className="text-lg font-bold">Home</h1>
          {/* <AuthButtonServer /> */}
        </div>
        {session ? (
          <NewTweet user={session.user} />
        ) : (
          <div className="flex justify-center p-3 gap-3 border-t border-neutral-200 dark:border-white/20">
            <AuthButtonServer />
          </div>
        )}
        {/* <TweetFeed tweets={tweets} /> */}
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
        <LoadMoreTweets />
      </main>

      <RightSideBar />
    </>
  );
}
