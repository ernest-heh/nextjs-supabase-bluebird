import { BiSearch } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

export default function RightSideBar() {
  return (
    <section className="hidden lg:flex w-[400px] pb-20 flex-col gap-2">
      {/* Search */}
      <div
        className="fixed top-0 z-10 py-2 bg-background ps-6"
        style={{ width: "inherit" }}
      >
        <div className="relative w-full h-full group">
          <label
            htmlFor="searchBox"
            className="absolute top-0 start-4 h-full flex items-center"
          >
            <BiSearch
              size={24}
              className="opacity-50 group-focus-within:text-twitter group-focus-within:opacity-100"
            />
          </label>
          <input
            type="text"
            id="searchBox"
            placeholder="Search Twitter"
            className="w-full h-full rounded-full outline-none focus:outline-twitter focus:outline-1 outline-offset-0 ps-14 py-3 focus:bg-transparent bg-zinc-100 dark:bg-zinc-800"
          />
          {/* <p className="group:focus-within:visible invisible">Hello</p> */}
        </div>
      </div>

      <div className="sticky top-0 pt-16 ps-6 flex flex-col gap-4">
        {/* Get Verified */}
        {/* <div className="p-4 pt-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 space-y-2">
          <h2 className="font-bold text-xl">Get Verified</h2>
          <p className="font-semibold text-sm">
            Subscribe to unlock new features.
          </p>
          <button className="rounded-full text-white font-bold bg-zinc-800 dark:bg-twitter py-[0.4em] px-4 hover:bg-opacity-80 transition duration-200">
            Get Verified
          </button>
        </div> */}

        {/* Trending */}
        {/* <div className="pt-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <h2 className="font-bold text-xl pb-2 px-4">Trends for you</h2>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 px-4 py-3 relative"
            >
              <p className="text-xs opacity-70">Trending</p>
              <p className="font-semibold text-sm pb-1">Figma</p>
              <p className="text-xs opacity-70">3,821 Tweets</p>
              <div className="absolute top-1 right-2 text-lg w-10 h-10 grid place-items-center text-neutral-400 cursor-pointer rounded-full aspect-square p-1 hover:bg-twitter/20 hover:text-twitter transition">
                <BsThreeDots />
              </div>
            </div>
          ))}
          <a
            href="#"
            className="block text-twitter rounded-b-2xl hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 p-4"
          >
            Show more
          </a>
        </div> */}

        {/* Who to Follow */}
        <div className="pt-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <h2 className="font-bold text-xl pb-2 px-4">Who to Follow</h2>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 px-4 py-3 relative flex items-center justify-between"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-400 shrink-0"></div>
                <div className="flex flex-col text-sm">
                  <a
                    href="#"
                    className="font-bold hover:underline hover:underline-offset-2"
                  >
                    Display Name
                  </a>
                  <div className="opacity-50">@handle</div>
                </div>
              </div>

              <button className="rounded-full text-sm text-white font-semibold bg-zinc-800 dark:bg-neutral-200 dark:text-black py-[0.4em] px-4 hover:bg-opacity-80 transition duration-200">
                Follow
              </button>
            </div>
          ))}
          <a
            href="#"
            className="block text-twitter rounded-b-2xl hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 p-4"
          >
            Show more
          </a>
        </div>
      </div>
    </section>
  );
}
