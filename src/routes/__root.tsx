import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import '@/styles/global.css';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <Link to="/snippets">Snippets</Link>
        <Link to="/prefixes">All Prefixes</Link>
        {/* <Link to="/snippets">Snippets</Link> */}
        <Link to="/snippetboss">Snippetboss</Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
