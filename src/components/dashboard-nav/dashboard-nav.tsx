"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons/index";
import { NavItem } from "@/app/helpers/types";
import axios from "axios";

export function DashboardNav({
  items,
  setOpen,
}: {
  items: NavItem[];
  setOpen: (value: boolean) => void;
}) {
  const path = usePathname();
  const router = useRouter();
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];

        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
                if (item.title === "Logout") {
                  axios
                    .get("/api/user/logout")
                    .then(() => {
                      router.push("/login");
                    })
                    .catch(() => {
                      console.log("logout error");
                    });
                }
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-accent-foreground",
                  path === item.href ? "bg-gray-200" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
