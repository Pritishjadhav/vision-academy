import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfileMenu } from "@/components/UserProfileMenu";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:block">
          <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold tracking-tight">Parent Portal</h2>
          </div>
          <nav className="p-4 flex flex-col space-y-2">
            <Link href="/parent" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Overview</Link>
            <Link href="/parent/performance" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Performance</Link>
            <Link href="/parent/attendance" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Attendance</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="md:hidden font-bold">Parent Portal</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserProfileMenu />
            </div>
          </header>
          <main className="p-6 flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
