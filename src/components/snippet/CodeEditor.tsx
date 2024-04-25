import React, { KeyboardEvent, useRef, useState } from 'react';
import { updateSnippet } from '@/api/snippet/update-snippet';
import { SnippetResponse } from '@/types';
import { StringModifier } from '@/utils/StringModifier';
import { snippet } from '@/types';

export const SnippetViewer = ({ snippet }: { snippet: SnippetResponse }) => {
  const TRANSFORM_OPTIONS = {
    DEFAULT: 'Default',
    VS_CODE: 'VS Code Snippet',
    RAW_CODE: 'Code',
  } as const;

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);

  const [isCopyHidden, setIsCopyHidden] = useState<boolean>(true);

  const [defaultValue, setDefaultValue] = useState<string>(
    snippet.snippet_content ?? '',
  );

  const [activeTab, setActiveTab] = useState<
    (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS]
  >(TRANSFORM_OPTIONS.DEFAULT);

  const transformedContent = (() => {
    switch (activeTab) {
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

  const handleTabChange = (
    newTab: (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS],
  ) => {
    setActiveTab(newTab);
  };

  const handleKeyDown = (
    e: KeyboardEvent,
    newTab: (typeof TRANSFORM_OPTIONS)[keyof typeof TRANSFORM_OPTIONS],
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleTabChange(newTab);
    }
  };

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
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const activeTabColor: string = '#444';

  const inactiveTabColor: string = '#333';

  const tabStyle: React.CSSProperties = {
    userSelect: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '10px 10px 0px 0px',
    display: 'inline-block',
    backgroundColor: inactiveTabColor,
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: activeTabColor,
  };

  const snippetStyling: React.CSSProperties = {
    outline: 'none',
    color: 'lightgreen',
    fontSize: '15px',
    fontWeight: 'bold',
    height: '200px',
    overflowY: 'scroll',
    width: '100%',
    border: '1px solid #666',
    borderRadius: '5px',
    margin: '0%',
    padding: '5px',
    cursor: isBeingEdited ? 'text' : 'pointer',
  };

  return (
    <>
      <h2
        className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white"
        style={{ textAlign: 'center' }}
      >
        {
          snippet.prefix_names.find((prefix_name) => prefix_name.is_default)
            ?.prefix_name
        }{' '}
        (
        {snippet.prefix_names
          .filter((prefix_name) => !prefix_name.is_default)
          .map((prefix_name) => prefix_name.prefix_name)
          .join(', ')}
        )
      </h2>
      <div
        style={{ width: '1000px', borderRadius: '10px 10px 10px 10px' }}
        onMouseEnter={() => setIsCopyHidden(true)}
        onMouseLeave={() => setIsCopyHidden(false)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div
            role="button"
            style={
              activeTab === TRANSFORM_OPTIONS.DEFAULT
                ? activeTabStyle
                : tabStyle
            }
            onClick={() => handleTabChange(TRANSFORM_OPTIONS.DEFAULT)}
            onKeyDown={(e: KeyboardEvent) =>
              handleKeyDown(e, TRANSFORM_OPTIONS.DEFAULT)
            }
            tabIndex={0}
          >
            {TRANSFORM_OPTIONS.DEFAULT}
          </div>
          <div
            role="button"
            style={
              activeTab === TRANSFORM_OPTIONS.VS_CODE
                ? activeTabStyle
                : tabStyle
            }
            onClick={() => handleTabChange(TRANSFORM_OPTIONS.VS_CODE)}
            onKeyDown={(e: KeyboardEvent) =>
              handleKeyDown(e, TRANSFORM_OPTIONS.VS_CODE)
            }
            tabIndex={0}
          >
            {TRANSFORM_OPTIONS.VS_CODE}
          </div>
          <div
            role="button"
            style={
              activeTab === TRANSFORM_OPTIONS.RAW_CODE
                ? activeTabStyle
                : tabStyle
            }
            onClick={() => handleTabChange(TRANSFORM_OPTIONS.RAW_CODE)}
            onKeyDown={(e: KeyboardEvent) =>
              handleKeyDown(e, TRANSFORM_OPTIONS.RAW_CODE)
            }
            tabIndex={0}
          >
            {TRANSFORM_OPTIONS.RAW_CODE}
          </div>
        </div>

        <div
          style={{
            backgroundColor: activeTabColor,
            padding: '20px',
            borderRadius: '0px 0px 10px 10px',
          }}
        >
          <button
            type="button"
            style={{
              visibility: isCopyHidden ? 'visible' : 'hidden',
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
              (async () => {
                try {
                  await navigator.clipboard.writeText(transformedContent);
                } catch (error) {
                  console.error('Failed to copy text to clipboard:', error);
                }
              })().catch(() => {});
            }}
          >
            <svg
              width="20"
              height="20"
              className="w-3.5 h-3.5 mr-2"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z" />
              <path d="M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z" />
            </svg>
          </button>

          <br />

          {isBeingEdited && (
            <textarea
              ref={textAreaRef}
              onBlur={(e) => {
                const updatedValue: string = e.currentTarget.value;
                handleUpdate(updatedValue);
              }}
              onKeyDown={(e) => {
                const CTRL_S: boolean =
                  (e.metaKey || e.ctrlKey) && e.key === 's';

                const CTRL_ENTER: boolean =
                  (e.metaKey || e.ctrlKey) && e.key === 'Enter';

                const ESCAPE: boolean = e.key === 'Escape';

                if (ESCAPE) {
                  e.currentTarget.blur();
                }

                if (CTRL_S || CTRL_ENTER) {
                  e.preventDefault();
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
      </div>
    </>
  );
};
