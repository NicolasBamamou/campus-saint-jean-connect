import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    navItems: {
        to: string;
        label: string;
        icon: React.ElementType;
    }[];
}

export function Sidebar({ className, navItems }: SidebarProps) {
    return (
        <div className={cn("hidden lg:block border-r", className)}>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <NavLink to="/" className="flex items-center gap-2 font-semibold">
                        <GraduationCap className="h-6 w-6" />
                        <span>Saint Jean</span>
                    </NavLink>
          </div>
                <div className="flex-1 overflow-auto py-2">
                    <ScrollArea className="h-full">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navItems.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={label}
                                    to={to}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                                            isActive && "bg-gray-100 text-gray-900"
                                        )
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                    </ScrollArea>
        </div>
          </div>
        </div>
    );
}
