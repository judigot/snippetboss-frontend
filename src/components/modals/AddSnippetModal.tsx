import { useState, useEffect, FormEvent } from 'react';
import { createSnippet } from '@/api/snippet/create-snippet';
import { unusedPrefixesByLanguageAtom } from '@/state';
import { language } from '@/types';
import { useAtom } from 'jotai';
import { readPrefixUnusedByLanguage } from '@/api/prefix/read-prefix-unused-by-language';

interface Props {
  language: language;
}

const snippetTypeOptions = {
  Global: 1,
  Specific: 2,
} as const;

function SnippetModal({ language }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [unusedPrefixesByLanguage, setUnusedPrefixesByLanguageAtom] = useAtom(
    unusedPrefixesByLanguageAtom,
  );
  const prefixOptions = unusedPrefixesByLanguage?.[language.language_name];

  const [formData, setFormData] = useState({
    prefix_id: '',
    snippet_type_id: '',
    snippet_content: '',
  });

  useEffect(() => {
    if (isOpen) {
      const textareaElement = document.getElementById(
        'snippet_content',
      ) as HTMLTextAreaElement | null;
      if (textareaElement) textareaElement.focus();
    }
  }, [isOpen]);

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
      formData.snippet_type_id
    ) {
      try {
        createSnippet({
          snippet: {
            snippet_content: formData.snippet_content,
            prefix_id: Number(formData.prefix_id),
            snippet_type_id: Number(formData.snippet_type_id),
          },
          language: language,
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
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors duration-150"
        onClick={() => setIsOpen(true)}
      >
        Add snippet
      </button>

      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
          tabIndex={-1}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          >
            <h1 className="text-xl font-bold text-white">
              Add {language.display_name} Snippet
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
                    const isLanguageNameNotInUnusedPrefixes =
                      !unusedPrefixesByLanguage ||
                      !(language.language_name in unusedPrefixesByLanguage);

                    if (isLanguageNameNotInUnusedPrefixes) {
                      readPrefixUnusedByLanguage(language.language_name)
                        .then((result) => {
                          if (result) {
                            /* Dynamically set a property on `setUnusedPrefixesByLanguageAtom` using `language_name` */
                            setUnusedPrefixesByLanguageAtom({
                              [language.language_name]: result,
                            });
                          }
                        })
                        .catch(() => {});
                    }
                  }}
                  id="prefix_id"
                  name="prefix_id"
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
                          )?.prefix_name || 'Default'}{' '}
                          - {prefix_description}
                        </option>
                      ),
                    )}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="snippet_type_id"
                  className="text-sm font-medium text-gray-300"
                >
                  Snippet Type
                </label>
                <select
                  id="snippet_type_id"
                  name="snippet_type_id"
                  value={formData.snippet_type_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a type</option>
                  {Object.entries(snippetTypeOptions).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </select>
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
      )}
    </>
  );
}

export default SnippetModal;