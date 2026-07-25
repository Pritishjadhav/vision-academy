import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfileMenu } from "@/components/UserProfileMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:block">
          <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
          </div>
          <nav className="p-4 flex flex-col space-y-2">
            <Link href="/admin" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Dashboard</Link>
            <Link href="/admin/batches" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Manage Batches</Link>
            <Link href="/admin/students" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Manage Students</Link>
            <Link href="/admin/parents" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Manage Parents</Link>
            <Link href="/admin/add-student-parent" className="px-4 py-2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium text-sm transition-colors">Add Student & Parent</Link>
            <Link href="/admin/videos" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Videos</Link>
            <Link href="/admin/tests" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Tests</Link>
            <Link href="/admin/announcements" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">Announcements</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="md:hidden font-bold">Admin Panel</div>
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
