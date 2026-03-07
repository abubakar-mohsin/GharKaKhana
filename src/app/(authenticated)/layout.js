import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Shared layout for all authenticated modules.
 * The middleware handles the redirect to /login, but this layout
 * adds a server-side safety net and injects the session into children.
 */
export default async function AuthenticatedLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Ghar Ka Khana</span>
        <span className="text-sm text-gray-500">
          {session.user?.name ?? session.user?.email} &nbsp;·&nbsp;
          <span className="capitalize text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
            {session.user?.role?.toLowerCase()}
          </span>
        </span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
