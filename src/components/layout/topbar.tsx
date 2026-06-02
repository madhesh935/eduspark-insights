import { useState } from "react";
import { Bell, Menu, Moon, Search, Sun, Check, ChevronDown } from "lucide-react";
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
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function detectRole(pathname: string): { role: string; name: string; email: string; avatar: string } {
  if (pathname.startsWith("/student"))
    return { role: "Student", name: "Aanya Sharma", email: "aanya@student.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aanya" };
  if (pathname.startsWith("/parent"))
    return { role: "Parent", name: "Parent of Aanya", email: "parent@family.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent" };
  if (pathname.startsWith("/admin"))
    return { role: "Administrator", name: "Admin User", email: "admin@insightedu.io", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" };
  return { role: "Teacher", name: "Sara Rao", email: "sara@insightedu.io", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" };
}

const roleColors: Record<string, string> = {
  Teacher: "bg-primary/10 text-primary",
  Student: "bg-success/10 text-success",
  Parent: "bg-destructive/10 text-destructive",
  Administrator: "bg-warning/10 text-warning",
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const [items, setItems] = useState(notifications);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [searchFocused, setSearchFocused] = useState(false);
  const unread = items.filter((i) => !i.read).length;
  const user = detectRole(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-2xl lg:px-6">

      {/* Mobile menu toggle */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Search bar */}
      <div className={cn(
        "relative hidden flex-1 max-w-md transition-all duration-300 md:block",
        searchFocused ? "max-w-lg" : ""
      )}>
        <Search className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
          searchFocused ? "text-primary" : "text-muted-foreground"
        )} />
        <Input
          placeholder="Search students, topics, assessments…"
          className="pl-9 h-9 rounded-xl bg-muted/60 border-transparent text-sm focus-visible:bg-background focus-visible:border-primary/30 focus-visible:ring-0 transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchFocused && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono bg-muted rounded px-1 py-0.5">
            ⌘K
          </div>
        )}
      </div>
      <div className="flex-1" />

      {/* Live indicator */}
      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-success/20 bg-success/8 px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-success status-live" />
        <span className="text-[10px] font-semibold text-success">Live</span>
      </div>

      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={toggle}
        className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={theme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.15 }}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="relative rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <AnimatePresence>
              {unread > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white"
                >
                  {unread}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl shadow-lifted border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-sm">Notifications</span>
              {unread > 0 && (
                <Badge className="bg-destructive/10 text-destructive text-[10px] h-4 px-1.5">{unread} new</Badge>
              )}
            </div>
            <button
              onClick={() => setItems(items.map(i => ({ ...i, read: true })))}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-[340px] overflow-y-auto scrollbar-thin divide-y divide-border/40">
            {items.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex gap-3 px-4 py-3 hover:bg-accent/40 transition cursor-pointer",
                  !n.read && "bg-primary/[0.035]"
                )}
              >
                <div className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.priority === "high" ? "bg-destructive" : n.priority === "medium" ? "bg-warning" : "bg-success"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-snug">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.body}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</div>
                </div>
                {!n.read && (
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
              </motion.div>
            ))}
          </div>
          <div className="border-t border-border/60 px-4 py-2.5 bg-muted/20">
            <button className="text-xs text-primary hover:underline w-full text-center">View all notifications</button>
          </div>
        </PopoverContent>
      </Popover>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-2.5 py-1.5 hover:bg-accent transition shadow-card"
            aria-label="Profile"
          >
            <Avatar className="h-7 w-7 ring-1 ring-border">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">{user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight">{user.name.split(" ")[0]}</div>
              <div className={cn("text-[9px] font-semibold rounded-sm px-1 leading-tight", roleColors[user.role])}>{user.role}</div>
            </div>
            <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-2xl shadow-lifted border-border/60">
          <DropdownMenuLabel className="py-3 px-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
                <Badge className={cn("text-[9px] mt-1 h-4", roleColors[user.role])}>{user.role}</Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">⚙️ Profile &amp; Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>🔔 Notification Preferences</DropdownMenuItem>
          <DropdownMenuItem>❓ Help Center</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/login" className="cursor-pointer text-destructive focus:text-destructive">
              → Sign out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
