import Image from "next/image";
import Likes from "./Likes";
import { formatDateToLocal } from "../lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

type TweetProps = {
  tweet: TweetWithAuthor;
};

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
const localeList = dayjs.Ls;
dayjs.updateLocale("en", {
  relativeTime: {
    ...localeList["en"].relativeTime,
    past: "%s",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mth",
    MM: "%dmth",
    y: "1y",
    yy: "%dy",
  },
});

export default function Tweet({ tweet }: TweetProps) {
  return (
    <div
      className="flex gap-3 p-3 border-b border-neutral-200 dark:border-white/20"
      key={tweet.id}
    >
      <div className="shrink-0">
        <Image
          alt="avatar"
          src={tweet.author.avatar_url}
          className="rounded-full"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <p className="flex gap-1 items-end text-[0.9em]">
          <span className="font-bold">{tweet.author.name}</span>{" "}
          <span className="text-neutral-500">@{tweet.author.username}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-500">
            {/* {new Date(tweet.created_at).toLocaleDateString()} */}
            {/* {formatDateToLocal(tweet.created_at)} */}
            {dayjs(tweet.created_at).fromNow()}
          </span>
        </p>
        <p className="whitespace-pre-line">{tweet?.title}</p>
        <Likes tweet={tweet} />
      </div>
    </div>
  );
}
