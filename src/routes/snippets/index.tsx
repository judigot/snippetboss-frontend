import { readSnippet } from '@/api/snippet/read-snippet';
import { SnippetViewer } from '@/components/snippet/CodeEditor';
import { SnippetResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/snippets/')({
  loader: async () => {
    return readSnippet().then((snippets: SnippetResponse[] | null) => snippets);
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
      <div className="flex items-center justify-center pb-10">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          All Snippets
        </h1>
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
