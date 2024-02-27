import { Outlet, createRootRoute } from '@tanstack/react-router';

import '@/styles/global.css';
import NavBar from '@/components/NavBar';
import LanguageFilter from '@/components/language/LanguageFilter';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <aside className="w-64 text-white p-4">
        <LanguageFilter />
      </aside>
      <main className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
