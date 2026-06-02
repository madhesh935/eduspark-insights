import { useState, type ReactNode } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AnimatePresence, motion } from "framer-motion";

export function AppLayout({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background gradient-mesh">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1680px] w-full mx-auto"
          >
            {children ?? <Outlet />}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
