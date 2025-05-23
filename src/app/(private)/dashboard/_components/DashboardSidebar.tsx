import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import {
  CalendarClock,
  Mail,
  MessageSquare,
  Users,
  Settings2,
  FileText,
  PenSquare,
  UserPlus,
  Home,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const listenersNavItems: NavItem[] = [
  {
    title: "Booked Calls",
    href: "/dashboard/booked-calls",
    icon: <CalendarClock size={20} />,
  },
  {
    title: "Messages",
    href: "/chat",
    icon: <MessageSquare size={20} />,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: <Mail size={20} />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User size={20} />,
  },
];

const adminNavItems: NavItem[] = [
  {
    title: "All Listener",
    href: "/dashboard/listeners",
    icon: <Users size={20} />,
  },
  {
    title: "Listener Requests",
    href: "/dashboard/listener-requests",
    icon: <UserPlus size={20} />,
  },
  {
    title: "Post A Blog",
    href: "/dashboard/post-blog",
    icon: <PenSquare size={20} />,
  },
  {
    title: "Blog Management",
    href: "/dashboard/blog-management",
    icon: <FileText size={20} />,
  },
  {
    title: "Data Customization",
    href: "/dashboard/data-customization",
    icon: <Settings2 size={20} />,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: <Mail size={20} />,
  },
];

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = React.useState("Booked Calls");
  const { user } = useAuth();

  const navItems = user?.role === "admin" ? adminNavItems : listenersNavItems;
  const dashboardTitle = "Dashboard";

  return (
    <aside className="sticky top-0 left-0 hidden w-60 flex-col border-r bg-white md:flex">
      <div className="p-2 pr-4 font-bold text-xl flex items-center justify-between">
        <Link href="/">
          <Button variant="secondary" size="icon">
            <Home size={20} />
          </Button>
        </Link>
        {dashboardTitle}
      </div>
      <Separator className="mt-1" />
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors font-bold hover:bg-soft-paste-light-active text-soft-paste-dark px-4 py-4",
              activeItem === item.title &&
                "bg-soft-paste-light-active font-medium",
            )}
            onClick={() => setActiveItem(item.title)}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
