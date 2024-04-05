import { Outlet, createRootRoute } from '@tanstack/react-router';

import '@/styles/global.css';
import NavBar from '@/components/NavBar';
import LanguageFilter from '@/components/language/LanguageFilter';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AddLanguageComponent } from '@/components/language/AddLanguageComponent';
import AddLanguageModal from '@/components/modals/AddLanguageModal';

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <aside className="w-64 text-white p-4">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px',
          }}
        >
          <LanguageFilter />
          <AddLanguageModal />
          <AddLanguageComponent />
        </div>
      </aside>
      <main className="mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
