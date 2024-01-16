import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import AuthButtonServer from "./components/AuthButtonServer";
import { redirect } from "next/navigation";
import NewTweet from "./components/NewTweet";
import Likes from "./components/Likes";

export default async function Home() {
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

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, profiles(*), likes(user_id)");

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      user_has_liked_tweet: tweet.likes.find(
        (like) => like.user_id === session?.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div className="border p-4" key={tweet.id}>
          <p className="text-sm text-neutral-400">
            {tweet?.profiles?.name} {tweet?.profiles?.username}
          </p>
          <p className="my-4">{tweet?.title}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </>
  );
}
