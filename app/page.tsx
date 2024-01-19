import AuthButtonServer from "./components/AuthButtonServer";
import LoadMoreTweets from "./components/LoadMoreTweets";
import NewTweet from "./components/NewTweet";
import Tweet from "./components/Tweet";
import { fetchTweets } from "./lib/actions";
import { createSupabaseServerComponentClient } from "./lib/supabase/supabase-server";

const INITIAL_NUMBER_OF_TWEETS = 10;

export default async function Home() {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const initialTweets = await fetchTweets({
    offset: 0,
    limit: INITIAL_NUMBER_OF_TWEETS,
  });

  return (
    <>
      <div className="flex justify-between items-center px-3 py-6 border-b border-neutral-200 dark:border-white/20">
        <h1 className="text-lg font-bold">Home</h1>
      </div>

      {session ? (
        <NewTweet user={session.user} />
      ) : (
        <div className="flex justify-center p-3 gap-3 border-t border-neutral-200 dark:border-white/20">
          <AuthButtonServer />
        </div>
      )}

      {initialTweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      <LoadMoreTweets />
    </>
  );
}
