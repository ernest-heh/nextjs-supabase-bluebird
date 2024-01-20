"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiErrorCircle } from "react-icons/bi";
import { toast } from "sonner";
import { addTweet } from "../lib/actions";
import { TweetFormSchema, TweetFormSchemaType } from "../lib/types";
import { cn } from "../lib/utils";

export default function NewTweet({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TweetFormSchemaType>({
    resolver: zodResolver(TweetFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const processForm: SubmitHandler<TweetFormSchemaType> = async (data) => {
    const result = await addTweet(data);

    if (!result) {
      toast.error("Something went wrong!");
      return;
    }

    if (!result.success) {
      console.log(result.message);
      return;
    }

    toast.success("Tweet posted!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="flex p-3 gap-3 border-b border-neutral-200 dark:border-white/20"
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
          {...register("title")}
          name="title"
          className="bg-inherit text-lg resize-none p-2 focus:outline-none rounded-md placeholder:opacity-80"
          placeholder="What is happening?!"
          rows={4}
        />
        <div className="flex justify-between">
          <div className="flex flex-row gap-1 text-rose-500 ">
            {errors.title?.message && <BiErrorCircle size={20} />}
            <p className="text-sm">{errors.title?.message}</p>
          </div>

          <button
            type="submit"
            aria-disabled={isSubmitting}
            disabled={isSubmitting}
            className={cn({
              "w-min self-end bg-twitter text-white px-[1.2em] py-[0.5em] text-sm font-bold rounded-full hover:bg-opacity-80 transition duration-200":
                true,
              "opacity-50 cursor-not-allowed":
                isSubmitting || watch("title").length === 0,
            })}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
