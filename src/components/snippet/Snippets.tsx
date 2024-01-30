// 'use client';

import { readSnippet } from '@/api/snippet/read-snippet';
import { updateSnippet } from '@/api/snippet/update-snippet';
import { SnippetResponseType } from '@/types/types';
import { StringModifier } from '@/utils/StringModifier';
import { language, snippet } from '@/types/types';
import { useEffect, useRef, useState } from 'react';

interface Props {
  language: language;
}

export default function Snippets({ language }: Props) {
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
    <>
      {snippets && (
        <>
          <h1>{language.display_name} Snippets</h1>
          {snippets?.map((snippet) => (
            <div key={snippet.snippet_id}>
              <h2>{snippet.prefix_name}</h2>
              {snippet.snippet_content !== null && (
                <TextArea snippet={snippet} />
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}

const TextArea = ({ snippet }: { snippet: SnippetResponseType }) => {
  const TRANSFORM_OPTIONS = {
    DEFAULT: 'Default',
    VS_CODE: 'VS Code Snippet',
    RAW_CODE: 'Code',
  } as const;

  const [defaultValue, setDefaultValue] = useState<string>(
    snippet.snippet_content ?? '',
  );

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);

  const [transformType, setTransformType] = useState<
    (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS]
  >(TRANSFORM_OPTIONS.RAW_CODE);

  const [prevRadioSelection, setPrevRadioSelection] = useState<
    (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS] | null
  >(null);

  const transformedContent = (() => {
    switch (transformType) {
      case TRANSFORM_OPTIONS.RAW_CODE:
        return StringModifier(defaultValue).removeDelimiters().get();

      case TRANSFORM_OPTIONS.VS_CODE:
        return StringModifier(defaultValue)
          .escapeQuotes()
          .convertToSnippetFormat(snippet)
          .get();

      default:
        return defaultValue;
    }
  })();

  const handleUpdate = (newValue: string) => {
    if (newValue !== defaultValue) {
      const body = {
        snippet_id: snippet.snippet_id,
        snippet_content: newValue,
      };
      updateSnippet(body)
        .then(
          ({
            snippet_content,
          }: {
            snippet_content: snippet['snippet_content'];
          }) => {
            if (snippet_content !== null) {
              setDefaultValue(snippet_content);
            }
          },
        )
        .catch(() => {});
    }
    setIsBeingEdited(() => false);
    if (prevRadioSelection) {
      setTransformType(() => prevRadioSelection);
    }
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const snippetStyling: React.CSSProperties = {
    color: 'lightgreen',
    fontSize: '15px',
    fontWeight: 'bold',
    height: '200px',
    overflowY: 'scroll',
    width: '100%',
    border: '1px solid gray',
    margin: '0%',
    padding: '5px',
    cursor: isBeingEdited ? 'text' : 'pointer',
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gap: '50px',
          gridTemplateColumns: '1fr 1fr',
          gridColumnGap: '50px',
        }}
      >
        <div>
          {isBeingEdited && (
            <textarea
              ref={textAreaRef}
              onBlur={(e) => {
                const updatedValue: string = e.currentTarget.value;
                handleUpdate(updatedValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.currentTarget.blur();
                }

                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  const updatedValue: string = e.currentTarget.value;
                  handleUpdate(updatedValue);
                }
              }}
              style={{
                ...snippetStyling,
                ...{
                  resize: 'none',
                },
              }}
              spellCheck={false}
              defaultValue={defaultValue}
            />
          )}

          {!isBeingEdited && (
            <pre
              onDoubleClick={() => {
                setPrevRadioSelection(() => transformType);
                setTransformType(() => TRANSFORM_OPTIONS.DEFAULT);
                setIsBeingEdited(() => true);
                setTimeout(() => {
                  textAreaRef.current?.focus();
                  const length = textAreaRef.current?.value.length;
                  if (length != null) {
                    textAreaRef.current?.setSelectionRange(length, length);
                  }
                });
              }}
              style={snippetStyling}
              contentEditable={isBeingEdited}
            >
              <code>{transformedContent}</code>
            </pre>
          )}
        </div>

        <div style={{ zoom: '150%' }}>
          {Object.entries(TRANSFORM_OPTIONS).map(
            (
              [transformOptionKey, transformOptionValue]: [
                string,
                (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS],
              ],
              i: number,
            ) => (
              <div key={i}>
                <input
                  style={{ cursor: 'pointer' }}
                  checked={transformType === transformOptionValue}
                  onChange={() => {
                    setTransformType(() => transformOptionValue);
                  }}
                  type="radio"
                  id={`${transformOptionKey}_${snippet.snippet_id}`}
                  name={`radio-option-${snippet.snippet_id}`}
                />
                <label
                  style={{ cursor: 'pointer' }}
                  htmlFor={`${transformOptionKey}_${snippet.snippet_id}`}
                >
                  {transformOptionValue}
                </label>
              </div>
            ),
          )}
          <br />
          <br />
          <br />
          <button
            onClick={() => {
              (async () => {
                try {
                  await navigator.clipboard.writeText(transformedContent);
                } catch (error) {
                  console.error('Failed to copy text to clipboard:', error);
                }
              })().catch(() => {});
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </>
  );
};
