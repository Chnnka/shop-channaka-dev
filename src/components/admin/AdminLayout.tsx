import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { site } from "../../data/site";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/Sheet";
import { ScrollToTop } from "../layout/ScrollToTop";
import { AdminSidebar } from "./AdminSidebar";
import { RequireAdmin } from "./RequireAdmin";

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <RequireAdmin>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-[#f6f2eb]">
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
          <AdminSidebar />
        </aside>
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 lg:hidden">
            <span className="font-serif text-xl">{site.name} · Admin</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex size-10 items-center justify-center rounded-sm hover:bg-sidebar-accent"
              aria-label="Open admin menu"
            >
              <Menu className="size-5" />
            </button>
          </header>
          <main
            id="main"
            className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 lg:px-10 lg:py-10"
          >
            <Outlet />
          </main>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate the studio admin
            </SheetDescription>
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </RequireAdmin>
  );
}
