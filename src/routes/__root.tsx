import { Outlet, createRootRoute } from '@tanstack/react-router';

import '@/styles/global.css';
import NavBar from '@/components/NavBar';
import LanguageFilter from '@/components/language/LanguageFilter';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <LanguageFilter />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
