"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { addTweet } from "../lib/actions";
import { TweetSchema } from "../lib/types";
import { useRef } from "react";

export default function NewTweet({ user }: { user: User }) {
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    // construct a new tweet object
    const newTweet = {
      title: formData.get("title"),
    };

    // client validation with zod
    const result = TweetSchema.safeParse(newTweet);

    if (!result.success) {
      let errorMessage = "";

      result.error.issues.forEach((issue) => {
        errorMessage += `${issue.message}\n`;
      });

      toast.error(errorMessage);

      return;
    }

    const response = await addTweet(result.data);

    if (response?.error) {
      // output error message
      toast.error(response.error);
    }

    // reset form
    ref.current?.reset();
  };

  return (
    <form
      action={handleSubmit}
      name="title"
      className="flex p-3 gap-3 border-b border-neutral-200 dark:border-white/20"
      ref={ref}
    >
      <div className="shrink-0">
        <Link href={`/profile/${user.user_metadata.user_name}`}>
          <Image
            alt="avatar"
            src={user.user_metadata.avatar_url}
            className="rounded-full hover:opacity-80 transition duration-200"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="flex flex-col w-full gap-2">
        <textarea
          name="title"
          className="bg-inherit text-lg resize-none p-2 focus:outline-none rounded-md placeholder:opacity-80"
          placeholder="What is happening?!"
          rows={4}
        />
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending, data } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={`w-min self-end bg-twitter text-white px-[1.2em] py-[0.5em] text-sm font-bold rounded-full hover:bg-opacity-80 transition duration-200 ${
        pending && "opacity-50 cursor-not-allowed"
      } ${!data && "opacity-50 cursor-not-allowed"}`}
    >
      Post
    </button>
  );
}
