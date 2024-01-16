import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";

export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server";
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

  return (
    <form
      action={addTweet}
      className="flex p-3 gap-3 border-t border-neutral-700"
    >
      <div className="">
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
          placeholder="What is happening?"
          rows={4}
        />
        <button className="w-min self-end bg-sky-500 px-[1.2em] py-[0.5em] text-sm font-bold rounded-full hover:saturate-200 transition">
          Post
        </button>
      </div>
    </form>
  );
}
