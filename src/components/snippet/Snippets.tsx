import { useEffect, useState } from 'react';
import { language } from '@/types';
import { readSnippet } from '@/api/snippet/read-snippet';
import { SnippetResponseType } from '@/types';
import { SnippetViewer } from '@/components/snippet/CodeEditor';
import AddSnippetForm from '@/components/snippet/AddSnippetForm';

interface Props {
  language: language;
}

export default function CodeEditor({ language }: Props) {
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

  const [isAddSnippetVisible, setIsAddSnippetVisible] =
    useState<boolean>(false);

  return (
    <section>
      {snippets && (
        <>
          <div style={{ textAlign: 'center' }}>
            <h1>{language.display_name} Snippets</h1>
            <button
              style={{
                width: '100%',
                display: 'grid',
                placeContent: 'center',
                background: 'none',
                color: 'inherit',
                border: 'none',
                padding: 0,
                font: 'inherit',
                cursor: 'pointer',
                outline: 'inherit',
              }}
              onClick={() => {
                setIsAddSnippetVisible(() => !isAddSnippetVisible);
              }}
            >
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    !isAddSnippetVisible
                      ? 'M12 4.5v15m7.5-7.5h-15'
                      : 'M6 18 18 6M6 6l12 12'
                  }
                />
              </svg>
            </button>

            {isAddSnippetVisible && (
              <>
                <br />
                <AddSnippetForm closeFormCallback={setIsAddSnippetVisible} />
              </>
            )}
          </div>
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
                  <SnippetViewer snippet={snippet} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
