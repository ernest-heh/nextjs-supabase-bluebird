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
    <form action={addTweet} className="max-w-md flex flex-col">
      <div className="">
        <Image
          alt="avatar"
          src={user.user_metadata.avatar_url}
          className="rounded-full"
          width={40}
          height={40}
        />
      </div>
      <textarea name="title" className="bg-inherit border" />
      <button className="max-w-[6em] bg-sky-500 py-2 rounded-full hover:saturate-200 transition">
        Tweet
      </button>
    </form>
  );
}
