import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import useClickOutside from "@/hooks/useClickOutside";

const NAV_LINKS = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Fincas", icon: "house", href: "/lands" },
  { name: "Razas", icon: "category", href: "/races" },
  { name: "Ganado", icon: "list_alt", href: "/cattle" },
  { name: "Transacciones", icon: "paid", href: "/transactions" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(menuRef, isOpen, () => setIsOpen(false));

  function handleLogout() {
    useAuthStore.getState().logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 w-full h-20 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span
            className="material-symbols-outlined"
            style={{ fontWeight: "300" }}
          >
            agriculture
          </span>
        </div>
        <h2 className="text-lg font-semibold">LivestockPro</h2>
      </div>

      <button
        className="md:hidden flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 active:scale-95 transform transition-all cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined">
          {isOpen ? "close" : "menu"}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden"
        >
          <nav className="p-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 font-label-md text-label-md transition-all duration-200 rounded-lg ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:bg-primary/10"
                  }`
                }
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
            <hr className="my-2 border-gray-200" />
            <button
              className="flex items-center gap-3 px-4 py-3 transition-all font-label-md text-label-md bg-red-50 text-red-500 w-full cursor-pointer rounded-lg active:scale-95 transform"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
