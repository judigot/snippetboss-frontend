import Prefixes from '@/components/prefix/Prefixes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prefixes/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return Promise.all([
      fetch(`http://localhost:3000/api/v1/prefixes/${language}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ])
      .then(([response1]) => Promise.all([response1.json()]))
      .then(([result1]: [unknown]) => {
        return {
          selectedLanguage: language,
          prefixes: result1,
        };
      });
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: PrefixesRoute,
});

function PrefixesRoute() {
  const { prefixes } = Route.useLoaderData();

  return (
    <>
      <Prefixes />
      <pre>{JSON.stringify(prefixes, null, 4)}</pre>
    </>
  );
}
