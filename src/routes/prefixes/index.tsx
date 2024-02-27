import { readPrefix } from '@/api/prefix/read-prefix';
import Prefixes from '@/components/prefix/Prefixes';
import { PrefixResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prefixes/')({
  loader: async () => {
    return readPrefix().then((result: PrefixResponse[] | null) => result);
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
