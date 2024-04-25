import { useEffect, useState } from 'react';
import { language } from '@/types';
import { SnippetResponse } from '@/types';
import { SnippetViewer } from '@/components/snippet/CodeEditor';
import AddSnippetForm from '@/components/snippet/AddSnippetForm';
import { unusedPrefixesByLanguageAtom } from '@/state';
import { readPrefixUnusedByLanguage } from '@/api/prefix/read-prefix-unused-by-language';
import { useAtom } from 'jotai';
import { readSnippetByLanguage } from '@/api/snippet/read-snippet-by-language';

interface Props {
  language: language;
}

export default function CodeEditor({ language }: Props) {
  const { display_name, language_name } = language;

  const [snippets, setSnippets] = useState<SnippetResponse[] | null>([]);

  const [unusedPrefixesByLanguage, setUnusedPrefixesByLanguage] = useAtom(
    unusedPrefixesByLanguageAtom,
  );

  useEffect(() => {
    readSnippetByLanguage(language_name)
      .then((result) => {
        if (result) {
          setSnippets(result);
        }
      })
      .catch(() => {});
  }, [language_name]);

  const [isAddSnippetVisible, setIsAddSnippetVisible] =
    useState<boolean>(false);

  return (
    <section>
      {snippets && (
        <>
          <div style={{ textAlign: 'center' }}>
            <h1>{display_name} Snippets</h1>
            <button
              type="button"
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
                const isLanguageNameNotInUnusedPrefixes =
                  !unusedPrefixesByLanguage ||
                  !(language_name in unusedPrefixesByLanguage);

                if (isLanguageNameNotInUnusedPrefixes) {
                  readPrefixUnusedByLanguage(language_name)
                    .then((result) => {
                      if (result) {
                        /* Dynamically set a property on `setUnusedPrefixesByLanguageAtom` using `language_name` */
                        setUnusedPrefixesByLanguage({
                          [language_name]: result,
                        });
                      }
                    })
                    .catch(() => {});
                }

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
                <AddSnippetForm
                  language={language}
                  closeFormCallback={setIsAddSnippetVisible}
                />
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
