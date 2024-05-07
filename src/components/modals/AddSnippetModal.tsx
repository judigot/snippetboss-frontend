import { useState, useEffect, FormEvent } from 'react';
import { createSnippet } from '@/api/snippet/create-snippet';
import {
  isAddPrefixModalVisibleAtom,
  isAddSnippetModalVisibleAtom,
  languagesAtom,
  selectedLangAtom,
  unusedPrefixesByLanguageAtom,
} from '@/state';
import { useAtom } from 'jotai';
import { readPrefixUnusedByLanguage } from '@/api/prefix/read-prefix-unused-by-language';

function AddSnippetModal() {
  const FORM_FIELDS = {
    SNIPPET_CONTENT: 'snippet_content',
    PREFIX_ID: 'prefix_id',
    PROGRAMMING_LANGUAGES: 'programming_languages',
    PROGRAMMING_LANGUAGES_INPUT: 'programming_languages_input',
  } as const;

  interface FormData {
    [FORM_FIELDS.SNIPPET_CONTENT]: string;
    [FORM_FIELDS.PREFIX_ID]: string;
    [FORM_FIELDS.PROGRAMMING_LANGUAGES]: string[];
    [FORM_FIELDS.PROGRAMMING_LANGUAGES_INPUT]: string;
  }

  const defaultValues = {
    [FORM_FIELDS.SNIPPET_CONTENT]: '',
    [FORM_FIELDS.PREFIX_ID]: '',
    [FORM_FIELDS.PROGRAMMING_LANGUAGES]: [],
    [FORM_FIELDS.PROGRAMMING_LANGUAGES_INPUT]: '',
  };

  const [selectedLang] = useAtom(selectedLangAtom);
  const [languages] = useAtom(languagesAtom);

  const [snippetLanguages, setSnippetLanguages] = useState<string[]>([]);

  const language = languages?.find(
    (language) => language.language_name === selectedLang,
  );

  const [, setIsOpen] = useAtom(isAddSnippetModalVisibleAtom);
  const [unusedPrefixesByLanguage, setUnusedPrefixesByLanguage] = useAtom(
    unusedPrefixesByLanguageAtom,
  );
  const prefixOptions =
    unusedPrefixesByLanguage?.[
      language?.language_name as (typeof language)[keyof typeof language]
    ];

  const [formData, setFormData] = useState<FormData>(defaultValues);

  const [, setIsAddPrefixModalVisible] = useAtom(isAddPrefixModalVisibleAtom);

  useEffect(() => {
    setFormData(defaultValues);
    setSnippetLanguages(() => {
      return [];
    });

    if (selectedLang !== undefined) {
      setSnippetLanguages((prevState) => {
        const prev: string[] | undefined = prevState;
        if (prev !== undefined) {
          prev.push(selectedLang);
          return prev;
        }
        return prevState;
      });
    }

    (document.querySelector('#snippet_content') as HTMLElement).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.snippet_content &&
      formData.prefix_id &&
      snippetLanguages.length > 0
    ) {
      const filteredLanguages =
        languages?.filter((language) =>
          snippetLanguages.includes(language.language_name),
        ) || [];

      try {
        createSnippet({
          snippet: {
            snippet_content: formData.snippet_content,
            prefix_id: Number(formData.prefix_id),
          },
          language: filteredLanguages,
        })
          .then(() => {
            setIsOpen(false); // Close modal on successful submission
          })
          .catch(() => {});
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      // Check if any form field is filled
      const isFormFilled =
        formData.snippet_content !== '' || formData.prefix_id !== '';

      // Only close the modal if no form fields are filled
      if (!isFormFilled) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        onKeyDown={() => {}}
        role="button" // Role "button" indicates the div acts like a button
        tabIndex={0} // tabIndex="0" makes the div focusable
        aria-label="Close modal" // Provides a label that describes the button's action
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-stone-900 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
          onKeyDown={(e) => {
            // Check if the Escape key was pressed
            if (e.key === 'Escape') {
              // Check if any form field is filled
              const isFormFilled =
                formData.snippet_content !== '' || formData.prefix_id !== '';
              // Only close the modal if no form fields are filled
              if (!isFormFilled) {
                setIsOpen(false);
              }
            }
          }}
          role="button" // Role "button" indicates the div acts like a button
          tabIndex={0} // tabIndex="0" makes the div focusable
          aria-label="Close modal" // Provides a label that describes the button's action
        >
          <h1 className="text-xl font-bold text-white">
            Add {language?.display_name} snippet
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="snippet_content"
                className="text-sm font-medium text-gray-300"
              >
                Snippet Content
              </label>
              <textarea
                id="snippet_content"
                name="snippet_content"
                required={true}
                value={formData.snippet_content}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[200px] max-h-[500px]"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="prefix_id"
                className="text-sm font-medium text-gray-300"
              >
                Prefix
              </label>
              <select
                onClick={() => {
                  if (language) {
                    const isLanguageNameNotInUnusedPrefixes =
                      !unusedPrefixesByLanguage ||
                      language.language_name in unusedPrefixesByLanguage;

                    if (isLanguageNameNotInUnusedPrefixes) {
                      readPrefixUnusedByLanguage(language.language_name)
                        .then((result) => {
                          if (result) {
                            /* Dynamically set a property on `setUnusedPrefixesByLanguageAtom` using `language_name` */
                            setUnusedPrefixesByLanguage({
                              [language.language_name]: result,
                            });
                          }
                        })
                        .catch(() => {});
                    }
                  }
                }}
                id="prefix_id"
                name="prefix_id"
                required={true}
                value={formData.prefix_id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a prefix</option>
                {prefixOptions &&
                  prefixOptions.map(
                    ({ prefix_id, prefix_description, prefix_names }) => (
                      <option key={prefix_id} value={prefix_id}>
                        {prefix_names.find(
                          (prefix_name) => prefix_name.is_default,
                        )?.prefix_name != null || 'Default'}
                        &nbsp;-&nbsp;{prefix_description}
                      </option>
                    ),
                  )}
              </select>
            </div>

            <div className="flex justify-center">or</div>
            <div className="flex justify-center">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={() => setIsAddPrefixModalVisible(true)}
                >
                  Add prefix
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddSnippetModal;
