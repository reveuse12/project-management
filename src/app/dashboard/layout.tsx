"use client";
import { DashboardNav } from "@/components/dashboard-nav/dashboard-nav";
import MobileSidebar from "@/components/dashboard-nav/mobile-nav";
import { cn } from "@/lib/utils";
import { NavItem } from "../helpers/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Organization",
    href: "/dashboard/organization",
    icon: "employee",
    label: "employee",
  },
  {
    title: "Projects",
    href: "/dashboard/project",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "Logout",
    href: "/",
    icon: "login",
    label: "login",
  },
];

function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileSidebar />
      <div className="flex h-screen overflow-hidden">
        <nav
          className={cn(
            `relative hidden h-screen border-r pt-16 lg:block w-72`
          )}
        >
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                  Overview
                </h2>
                <DashboardNav items={navItems} setOpen={() => true} />
              </div>
            </div>
          </div>
        </nav>
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
}

export default LayoutDashboard;
