import Prefixes from '@/components/prefix/Prefixes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prefixes/')({
  loader: async () => {
    return fetch(`http://localhost:3000/api/v1/prefixes`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result: unknown) => result);
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: PrefixesRoute,
});

function PrefixesRoute() {
  const prefixes = Route.useLoaderData();

  return (
    <>
      <Prefixes />
      <pre>{JSON.stringify(prefixes, null, 4)}</pre>
    </>
  );
}
