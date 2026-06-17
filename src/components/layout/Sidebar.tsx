import { useAuthStore } from "@/stores/auth.store";
import { NavLink, useNavigate } from "react-router";

const NAV_LINKS = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Fincas", icon: "house", href: "/lands" },
  { name: "Razas", icon: "category", href: "/races" },
  { name: "Ganado", icon: "list_alt", href: "/cattle" },
  { name: "Transacciones", icon: "paid", href: "/transactions" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    useAuthStore.getState().logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex flex-col h-full w-64 fixed min-h-screen left-0 top-0 border-r border-gray-200 py-8 z-50 px-4 text-text-primary">
      {/* Begin: Logo and name */}
      <div className="flex items-center gap-2 mb-10">
        <div className="size-12 bg-primary rounded-lg flex items-center justify-center text-white">
          <span
            className="material-symbols-outlined"
            style={{ fontWeight: "300" }}
          >
            agriculture
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold">LivestockPro</h2>
        </div>
      </div>
      {/* End: Logo and name */}

      {/* Begin: Navigation Links */}
      <nav className="space-y-1">
        {NAV_LINKS.map((link) => (
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-label-md text-label-md transition-all duration-200 active:scale-95 transform ${
                isActive
                  ? "bg-primary text-white translate-x-1"
                  : "text-on-surface-variant hover:bg-primary/10 hover:translate-x-1"
              }`
            }
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
      {/* End: Navigation Links */}

      {/* Begin: Logout */}
      <div className="mt-auto pt-6 border-t border-gray-200 space-y-1">
        <button
          className="flex items-center gap-3 px-4 py-3 transition-all font-label-md text-label-md bg-red-50 text-red-500 active:scale-95 transform w-full cursor-pointer hover:translate-x-1"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
      {/* End: Logout */}
    </aside>
  );
}
