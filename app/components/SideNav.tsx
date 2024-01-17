import AuthButtonServer from "./AuthButtonServer";
import NavLinks from "./NavLinks";

export default function SideNav() {
  return (
    <aside className="block min-w-20 xl:w-[275px] p-1 pe-4 pb-4 relative">
      <div className="fixed top-0 h-screen pb-4 flex flex-col justify-between">
        <NavLinks />
        {/* <p>Logout</p> */}
        <AuthButtonServer />
      </div>
    </aside>
  );
}
