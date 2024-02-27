import { readPrefixByLanguage } from '@/api/prefix/read-prefix-by-language';
import Prefixes from '@/components/prefix/Prefixes';
import { prefix } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prefixes/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }
    return readPrefixByLanguage(language).then((prefixes: prefix[] | null) => {
      return {
        selectedLanguage: language,
        prefixes,
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
