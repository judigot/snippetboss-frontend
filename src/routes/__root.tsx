import { Outlet, createRootRoute } from '@tanstack/react-router';

import '@/styles/global.css';
import NavBar from '@/components/NavBar';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import SideBar from '@/App';

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <div className="flex items-center justify-center pb-10">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Custom 404 (__root.tsx)
        </h1>
      </div>
    );
  },
  component: () => (
    <>
      <NavBar />
      <SideBar />
      <main className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
