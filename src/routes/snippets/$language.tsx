import LanguageFilter from '@/components/language/LanguageFilter';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return Promise.all([
      fetch(`http://localhost:3000/api/v1/languages`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(`http://localhost:3000/api/v1/snippets/${language}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ])
      .then(([response1, response2]) =>
        Promise.all([response1.json(), response2.json()]),
      )
      .then(([result1, result2]: [unknown, unknown]) => {
        return {
          selectedLanguage: language,
          languages: result1,
          snippets: result2,
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
  const { selectedLanguage, snippets } = Route.useLoaderData();

  return (
    <>
      <LanguageFilter language={selectedLanguage} />
      <pre>{JSON.stringify(snippets, null, 4)}</pre>
    </>
  );
}
