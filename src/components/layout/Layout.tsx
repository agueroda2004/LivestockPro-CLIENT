import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1 min-h-screen md:ml-64">
        <Header />
        <div className="p-12 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
