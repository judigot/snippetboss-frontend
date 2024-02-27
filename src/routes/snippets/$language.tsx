import { readSnippetByLanguage } from '@/api/snippet/read-snippet-by-language';
import { snippet } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return readSnippetByLanguage(language).then(
      (snippets: snippet[] | null) => {
        return {
          selectedLanguage: language,
          snippets,
        };
      },
    );
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
