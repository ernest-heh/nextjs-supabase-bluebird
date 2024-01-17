"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { addTweet } from "../lib/actions";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

export default function NewTweet({ user }: { user: User }) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      action={async (formData) => {
        await addTweet(formData);
        ref.current?.reset();
      }}
      className="flex p-3 gap-3 border-y border-neutral-200 dark:border-white/20"
      ref={ref}
    >
      <div className="shrink-0">
        <Image
          alt="avatar"
          src={user.user_metadata.avatar_url}
          className="rounded-full"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <textarea
          name="title"
          className="bg-inherit text-lg resize-none p-2 focus:outline-none rounded-md"
          placeholder="What is happening?!"
          rows={4}
        />
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`w-min self-end bg-twitter text-white px-[1.2em] py-[0.5em] text-sm font-bold rounded-full hover:bg-opacity-80 transition duration-200 ${
        pending && "opacity-50 cursor-not-allowed"
      }`}
    >
      Post
    </button>
  );
}
