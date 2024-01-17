"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiBell,
  BiBookmark,
  BiEnvelope,
  BiHomeCircle,
  BiSearch,
  BiSolidHomeCircle,
  BiSolidUser,
  BiUser,
} from "react-icons/bi";
import { BsPlus } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { cn } from "../lib/utils";

const NAVIGATION_ITEMS = [
  {
    title: "Twitter",
    pathname: "/",
    icon: FaTwitter,
    iconSelect: FaTwitter,
  },
  {
    title: "Home",
    pathname: "/",
    icon: BiHomeCircle,
    iconSelect: BiSolidHomeCircle,
  },
  {
    title: "Explore",
    pathname: "/explore",
    icon: BiSearch,
    iconSelect: BiSearch,
  },
  {
    title: "Notifications",
    pathname: "/notifications",
    icon: BiBell,
    iconSelect: BiBell,
  },
  {
    title: "Messages",
    pathname: "/messages",
    icon: BiEnvelope,
    iconSelect: BiEnvelope,
  },
  {
    title: "Bookmarks",
    pathname: "/bookmarks",
    icon: BiBookmark,
    iconSelect: BiBookmark,
  },
  // {
  //   title: "Profile",
  //   // pathname: "/profile",
  //   pathname: `/profile/${userHandle}`,
  //   icon: BiUser,
  //   iconSelect: BiSolidUser,
  // },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    // <div className="">
    //   <h1>SideNav</h1>
    //   <p>Button</p>
    //   <p>Button</p>
    //   <p>Button</p>
    // </div>
    <div className="text-xl pe-4">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          className="hover:bg-black/10 dark:hover:bg-white/10 transition duration-200 rounded-full px-4 py-3 mb-2 flex justify-start w-fit items-center space-x-4"
          href={
            item.title.toLocaleLowerCase() === "home"
              ? "/"
              : item.title.toLocaleLowerCase() === "twitter"
              ? "/"
              : item.pathname.toLowerCase()
          }
          key={item.title}
        >
          <div className="w-fit grid place-items-center text-2xl">
            {item.title === "Twitter" ? (
              <item.icon className="text-3xl text-twitter dark:text-white" />
            ) : item.pathname === pathname ? (
              <item.iconSelect className="text-3xl" />
            ) : (
              <item.icon className="text-3xl" />
            )}
          </div>
          {item.title !== "Twitter" && (
            <div
              className={cn(
                "hidden xl:block",
                item.pathname === pathname && "font-bold"
              )}
            >
              {item.title}
            </div>
          )}
        </Link>
      ))}
      <button className="w-full rounded-full text-white font-bold bg-twitter py-3 mt-4 hover:bg-opacity-80 transition duration-200">
        <span className="hidden xl:block">Tweet</span>
        <span className="grid xl:hidden place-items-center text-3xl">
          <BsPlus />
        </span>
      </button>
    </div>
  );
}
