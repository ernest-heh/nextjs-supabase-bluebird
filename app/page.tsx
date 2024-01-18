import AuthButtonServer from "./components/AuthButtonServer";
import LoadMoreTweets from "./components/LoadMoreTweets";
import NewTweet from "./components/NewTweet";
import RightSideBar from "./components/RightSideBar";
import SideNav from "./components/SideNav";
import Tweet from "./components/Tweet";
import { fetchTweets } from "./lib/actions";
import { createSupabaseServerComponentClient } from "./lib/supabase/supabase-server";

const INITIAL_NUMBER_OF_TWEETS = 10;

export default async function Home() {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
        </div>

        {session ? (
          <NewTweet user={session.user} />
        ) : (
          <div className="flex justify-center p-3 gap-3 border-t border-neutral-200 dark:border-white/20">
            <AuthButtonServer />
          </div>
        )}

        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
        <LoadMoreTweets />
      </main>

      <RightSideBar />
    </>
  );
}
