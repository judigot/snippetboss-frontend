import { useEffect, useState } from 'react';
import { CodeEditor } from '@/components/snippet/CodeEditor';
import { language } from '@/types';
import { readSnippet } from '@/api/snippet/read-snippet';
import { SnippetResponseType } from '@/types';

interface Props {
  language: language;
}

export default function CodeViewer({ language }: Props) {
  const [snippets, setSnippets] = useState<SnippetResponseType[] | null>([]);

  useEffect(() => {
    readSnippet(language.language_name)
      .then((result) => {
        if (result) {
          setSnippets(result);
        }
      })
      .catch(() => {});
  }, [language]);

  return (
    <section>
      {snippets && (
        <>
          <h1 style={{ textAlign: 'center' }}>
            {language.display_name} Snippets
          </h1>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {snippets?.map((snippet) => (
              <div key={snippet.snippet_id}>
                <h2>{snippet.prefix_name}</h2>
                {snippet.snippet_content !== null && (
                  <CodeEditor snippet={snippet} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
