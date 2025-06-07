import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Tag,
  Truck,
  Palette,
  Ruler
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/dashboard/products",
    color: "text-violet-500"
  },
  {
    label: "Categories",
    icon: Tag,
    href: "/dashboard/categories",
    color: "text-pink-500"
  },
  {
    label: "Orders",
    icon: Package,
    href: "/dashboard/orders",
    color: "text-orange-500"
  },
  {
    label: "Suppliers",
    icon: Truck,
    href: "/dashboard/suppliers",
    color: "text-green-500"
  },
  {
    label: "Colors",
    icon: Palette,
    href: "/dashboard/colors",
    color: "text-yellow-500"
  },
  {
    label: "Sizes",
    icon: Ruler,
    href: "/dashboard/sizes",
    color: "text-blue-500"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500"
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <h1 className="text-2xl font-bold">ELP</h1>
          </div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-gray-700/50 rounded-lg transition",
                pathname === route.href ? "text-white bg-gray-700/50" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
