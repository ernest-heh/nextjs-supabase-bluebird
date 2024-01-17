import Link from "next/link";
import AuthButtonServer from "./AuthButtonServer";
import NavLinks from "./NavLinks";
import { getDbOnServer } from "../lib/supabase";
import { BsThreeDots } from "react-icons/bs";
import Image from "next/image";

export default async function SideNav() {
  const supabase = await getDbOnServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <aside className="block min-w-20 xl:w-[275px] p-1 pe-4 pb-4 relative">
      <div className="fixed top-0 h-screen pb-4 flex flex-col justify-between">
        <NavLinks />
        {/* <p>Logout</p> */}
        <div className="">
          <AuthButtonServer />
          {session?.user && (
            <Link
              href={`/profile/${session.user.user_metadata.user_name}`}
              className="hover:bg-black/10 dark:hover:bg-white/10 transition duration-200 w-full p-3 rounded-full flex items-center gap-2 justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                  <Image
                    alt="avatar"
                    src={session.user.user_metadata.avatar_url}
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="hidden xl:block text-sm">
                  <div className="font-bold">
                    {session.user.user_metadata.full_name}
                  </div>
                  <div className="text-neutral-400">
                    @{session.user.user_metadata.user_name}
                  </div>
                </div>
              </div>
              <div className="hidden xl:block text-xl">
                <BsThreeDots />
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
