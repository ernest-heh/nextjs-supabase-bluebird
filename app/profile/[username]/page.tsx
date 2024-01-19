import BackButton from "@/app/components/BackButton";
import LoadMoreTweetsFromUser from "@/app/components/LoadMoreTweetsFromUser";
import Tweet from "@/app/components/Tweet";
import {
  fetchTotalTweetsFromUser,
  fetchTweets,
  getProfile,
} from "@/app/lib/actions";
import { GoArrowLeft } from "react-icons/go";
import Image from "next/image";

const INITIAL_NUMBER_OF_TWEETS = 10;

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfile(params.username);

  const userId = user && (user.id as string);

  const initialTweets = await fetchTweets({
    offset: 0,
    limit: INITIAL_NUMBER_OF_TWEETS,
    id: userId,
  });

  const tweetCount = await fetchTotalTweetsFromUser(userId || "");

  return (
    <>
      <div className="flex flex-col px-3 py-3 border-b border-neutral-200 dark:border-white/20">
        <div className="flex gap-3">
          <div className="w-14 flex items-center">
            <BackButton className="flex justify-center items-center p-2 aspect-square shrink-0 transition duration-200 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
              <GoArrowLeft size={22} />
            </BackButton>
          </div>
          <div className="w-full">
            <h1 className="text-lg font-bold">{user?.name}</h1>
            <p className="text-sm text-neutral-500">
              {tweetCount ?? 0}{" "}
              {tweetCount && tweetCount > 1 ? "Tweets" : "Tweet"}
            </p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-twitter/40"></div>

      <div className="pb-4 px-4 border-b border-neutral-200 dark:border-white/20">
        <div className="flex justify-betweem">
          <Image
            alt="avatar"
            src={user?.avatar_url}
            className="rounded-full transition duration-200 border-4 border-white dark:border-black -mt-[12.5%] shrink-0"
            width={0}
            height={0}
            sizes="33vw"
            style={{ width: "25%", height: "auto" }}
            quality={50}
          />
          <div className=""></div>
        </div>
        <div className="">
          <p className="text-lg font-bold mt-2 -mb-1">{user?.name}</p>
          <p className="text-sm text-neutral-500">@{user?.username}</p>
        </div>
      </div>

      <div className="">
        {initialTweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
        <LoadMoreTweetsFromUser id={userId ?? ""} />
      </div>
    </>
  );
}
