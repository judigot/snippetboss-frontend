import { readSnippetByLanguage } from '@/api/snippet/read-snippet-by-language';
import { SnippetViewer } from '@/components/snippet/CodeEditor';
import { languagesAtom } from '@/state';
import { SnippetResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';

export const Route = createFileRoute('/snippets/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return readSnippetByLanguage(language).then(
      (snippets: SnippetResponse[] | null) => {
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

  component: SnippetsRoute,
});

function SnippetsRoute() {
  const [selectedLang] = useAtom(languagesAtom);
  const { snippets, selectedLanguage } = Route.useLoaderData();

  return (
    <>
      <div className="flex items-center justify-center pb-10">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {selectedLang &&
            selectedLang.find((lang) => lang.language_name === selectedLanguage)
              ?.display_name}{' '}
          Snippets
        </h1>
      </div>

      {snippets?.map((snippet) => (
        <div key={snippet.snippet_id}>
          {snippet.snippet_content !== null && (
            <div className="pb-80">
              <SnippetViewer snippet={snippet} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
