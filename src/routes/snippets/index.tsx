import LanguageFilter from '@/components/language/LanguageFilter';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/')({
  loader: async () => {
    return fetch(`http://localhost:3000/api/v1/snippets`, {
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

  component: About,
});

function About() {
  const snippets = Route.useLoaderData();

  return (
    <>
      <LanguageFilter />
      <pre>{JSON.stringify(snippets, null, 4)}</pre>
    </>
  );
}
