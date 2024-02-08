import { createSnippet } from '@/api/snippet/create-snippet';
import { unusedPrefixesByLanguageAtom } from '@/state';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';

interface Props {
  language: string;
  closeFormCallback: (value: boolean) => void;
}

const snippetTypeOptions = {
  Global: 1,
  Specific: 2,
} as const;

export default function Form({
  language,
  closeFormCallback: setIsAddSnippetVisible,
}: Props) {
  const [unusedPrefixesByLanguage] = useAtom(unusedPrefixesByLanguageAtom);

  const prefixOptions =
    unusedPrefixesByLanguage && unusedPrefixesByLanguage[language];

  const [formData, setFormData] = useState<{
    prefix_id: number | undefined;
    snippet_type_id:
      | (typeof snippetTypeOptions)[keyof typeof snippetTypeOptions]
      | undefined;
    snippet_content: string | undefined;
  }>({
    snippet_content: undefined,
    snippet_type_id: undefined,
    prefix_id: undefined,
  });

  const isAnyInputFilled = Object.values(formData).some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const isEveryInputFilled = Object.values(formData).every(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const [isSubmitButtonVisible, setIsSubmitButtonVisible] =
    useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ?? value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (
      isEveryInputFilled &&
      formData.snippet_content !== undefined &&
      formData.prefix_id !== undefined &&
      formData.snippet_type_id !== undefined
    ) {
      createSnippet({
        snippet_content: formData.snippet_content ?? '',
        prefix_id: formData.prefix_id,
        snippet_type_id: Number(formData.snippet_type_id),
      })
        .then(() => {
          setIsAddSnippetVisible(false);
        })
        .catch(() => {});
    }
  };

  const handleKeyDown = (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLSelectElement>,
  ) => {
    const CTRL_ENTER: boolean = (e.metaKey || e.ctrlKey) && e.key === 'Enter';
    const ESCAPE: boolean = e.key === 'Escape';

    if (ESCAPE) {
      handleCloseSnippet();
    }
    if (CTRL_ENTER) {
      handleSubmit();
    }
  };

  const handleCloseSnippet = () => {
    if (isAnyInputFilled) {
      // eslint-disable-next-line no-alert
      if (confirm('Discard unsaved snippet?')) {
        setIsAddSnippetVisible(false);
      }
      return;
    }
    setIsAddSnippetVisible(false);
  };

  useEffect(() => {
    const snippet_content = document.querySelector(
      `#snippet_content`,
    ) as HTMLTextAreaElement;
    snippet_content.focus();
  }, []);

  useEffect(() => {
    setIsSubmitButtonVisible(isEveryInputFilled);
  }, [isEveryInputFilled, formData]);

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <label htmlFor="snippet_content">
        Snippet
        <br />
        <textarea
          id="snippet_content"
          name="snippet_content"
          value={formData.snippet_content}
          onChange={handleChange}
          aria-label="Textarea Input"
          spellCheck={false}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          style={{
            height: '100px',
            width: '500px',
            resize: 'none',
          }}
        />
      </label>
      <br />
      <br />
      <label htmlFor="prefix_id">
        Prefix
        <br />
        <select
          id="prefix_id"
          name="prefix_id"
          value={formData.prefix_id}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          aria-label="Select Dropdown"
        >
          <option value="">Select a prefix</option>
          {prefixOptions &&
            Object.entries(prefixOptions).map(
              ([_key, { prefix_id, prefix_description, prefix_names }]) => (
                <option key={prefix_id} value={prefix_id}>
                  {
                    prefix_names.find((prefix_name) => prefix_name.is_default)
                      ?.prefix_name
                  }
                  &nbsp;-&nbsp;
                  {prefix_description}
                </option>
              ),
            )}
        </select>
      </label>
      <br />
      <br />
      <label htmlFor="snippet_type_id">
        Snippet Type
        <br />
        <select
          id="snippet_type_id"
          name="snippet_type_id"
          value={formData.snippet_type_id}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          aria-label="Select Dropdown"
        >
          <option value="">Select a type</option>
          {Object.entries(snippetTypeOptions).map(([key, option]) => (
            <option key={option} value={option}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <br />
      {isSubmitButtonVisible && (
        <>
          <button type="submit">Submit</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      <button
        type="button"
        onClick={() => {
          handleCloseSnippet();
        }}
      >
        Cancel
      </button>
      <hr />
    </form>
  );
}
