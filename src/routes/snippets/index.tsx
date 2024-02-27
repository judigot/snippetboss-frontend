import { readSnippet } from '@/api/snippet/read-snippet';
import { snippet } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/')({
  loader: async () => {
    return readSnippet().then((snippets: snippet[] | null) => snippets);
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: SnippetsRoute,
});

function SnippetsRoute() {
  const snippets = Route.useLoaderData();

  return (
    <>
      <pre>{JSON.stringify(snippets, null, 4)}</pre>
    </>
  );
}
