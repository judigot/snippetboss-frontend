import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return Promise.all([
      fetch(`http://localhost:3000/api/v1/snippets/${language}`, {
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
          snippets: result1,
        };
      });
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: Snippets,
});

function Snippets() {
  const { snippets } = Route.useLoaderData();

  return (
    <>
      <pre>{JSON.stringify(snippets, null, 4)}</pre>
    </>
  );
}
