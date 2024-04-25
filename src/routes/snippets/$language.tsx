import { readSnippetByLanguage } from '@/api/snippet/read-snippet-by-language';
import { SnippetViewer } from '@/components/snippet/CodeEditor';
import { isAddSnippetModalVisibleAtom, languagesAtom } from '@/state';
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
  const [languages] = useAtom(languagesAtom);
  const { snippets, selectedLanguage } = Route.useLoaderData();
  const selectedLangData =
    languages &&
    languages.find((lang) => lang.language_name === selectedLanguage);

  const [, setIsAddSnippetModalVisible] = useAtom(isAddSnippetModalVisibleAtom);

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {selectedLangData?.display_name}&nbsp;Snippets
        </h1>
      </div>
      <div className="flex items-center justify-center pb-10">
        <button
          type="button"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors duration-150"
          onClick={() => setIsAddSnippetModalVisible(true)}
        >
          Add snippet
        </button>
      </div>

      {snippets?.map((snippet) => (
        <div key={snippet.snippet_id}>
          {snippet.snippet_content !== null && (
            <div className="pb-10">
              <SnippetViewer snippet={snippet} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
