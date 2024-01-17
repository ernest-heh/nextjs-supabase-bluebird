"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const getTweets = async (offset: number, limit: number) => {
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

  try {
    const { data } = await supabase
      .from("tweets")
      .select("*, author: profiles(*), likes(user_id)")
      .order("created_at", { ascending: false })
      .range(offset, limit);

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

    return tweets;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tweets: ${error.message}`);
    } else {
      throw new Error(`Unknown error: ${error}`);
    }
  }
};

export const addTweet = async (formData: FormData) => {
  const title = String(formData.get("title"));

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
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("tweets").insert({ title, user_id: user.id });
    revalidatePath("/");
  }
};
