import { useState } from "react";
import { Bell, Menu, Moon, Search, Sun, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { notifications } from "@/lib/mock-data";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const [items, setItems] = useState(notifications);
  const unread = items.filter((i) => !i.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <button className="lg:hidden text-muted-foreground" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search students, topics, classes…" className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background" />
      </div>
      <div className="flex-1 md:hidden" />

      <button
        onClick={toggle}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition" aria-label="Notifications">
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b p-3">
            <div className="font-semibold text-sm">Notifications</div>
            <button onClick={() => setItems(items.map(i => ({ ...i, read: true })))} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {items.map((n) => (
              <div key={n.id} className={cn("flex gap-3 border-b p-3 last:border-0 hover:bg-accent/40 transition", !n.read && "bg-primary/5")}>
                <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full",
                  n.priority === "high" ? "bg-destructive" : n.priority === "medium" ? "bg-warning" : "bg-success")} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{n.body}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                </div>
                {!n.read && <Check className="h-3.5 w-3.5 text-primary self-start" />}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-accent transition" aria-label="Profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight">Sara Rao</div>
              <div className="text-[10px] text-muted-foreground">Teacher</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-semibold">Sara Rao</div>
            <div className="text-xs text-muted-foreground font-normal">sara@insightedu.io</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/settings">Profile & Settings</Link></DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Help Center</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/login">Sign out</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Badge variant="secondary" className="hidden lg:inline-flex">v1.0</Badge>
    </header>
  );
}
