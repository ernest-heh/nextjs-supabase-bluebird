"use server";

import { revalidatePath } from "next/cache";
import { Profile } from "./global";
import { createSupabaseServerClient } from "./supabase/supabase-server";
import { TweetFormSchema, TweetFormSchemaType } from "./types";
import { ZodError } from "zod";

interface FetchTweetProps {
  offset: number;
  limit: number;
  id?: string | null;
}

const MAX_NUMBER_OF_TWEETS = 10;

export const fetchTweets = async ({
  offset = 0,
  limit = MAX_NUMBER_OF_TWEETS,
  id,
}: FetchTweetProps) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    const { data } = await supabase
      .from("tweets")
      .select("*, author: profiles(*), likes(user_id)")
      .order("created_at", { ascending: false })
      .range(offset, limit);

    if (id) {
      const tweets =
        data
          ?.filter((tweet) => tweet.user_id === id)
          .map((tweet) => ({
            ...tweet,
            // check if author is an array, if so, use the first element
            author: Array.isArray(tweet.author)
              ? tweet.author[0]
              : tweet.author,
            user_has_liked_tweet: !!tweet.likes.find(
              (like) => like.user_id === session?.user.id
            ),
            likes: tweet.likes.length,
          })) ?? [];
      return tweets;
    } else {
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
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tweets: ${error.message}`);
    } else {
      throw new Error(`Unknown error: ${error}`);
    }
  }
};

export const fetchTotalTweetsFromUser = async (id: string) => {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*)")
    .eq("user_id", id);

  return data?.length;
};

export const addTweet = async (data: TweetFormSchemaType) => {
  // const title = String(formData.get("title"));

  // // server-side validation
  const result = TweetFormSchema.safeParse(data);

  // if (!result.success) {
  //   let errorMessage = "";

  //   result.error.issues.forEach((issue) => {
  //     errorMessage += `${issue.path[0]}: ${issue.message}.\n`;
  //   });

  //   return { error: errorMessage };
  // }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!result.success) {
      return { success: false, message: result.error.format() };
    } else {
      await supabase
        .from("tweets")
        .insert({ title: result.data.title, user_id: user.id });
      revalidatePath("/");
      return { success: true, message: "Tweet added successfully" };
    }
  }
};

export const getProfile = async (username: string) => {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  return data as Profile;
};
