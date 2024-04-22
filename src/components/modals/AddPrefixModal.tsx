import React, { FormEvent, useEffect, useRef, useState } from 'react'; // Now including useRef
import { PrefixRequestBody, createPrefix } from '@/api/prefix/create-prefix'; // Ensure this API function is correctly implemented
import {
  isAddPrefixModalVisibleAtom,
  languagesAtom,
  selectedLangAtom,
  unusedPrefixesByLanguageAtom,
} from '@/state';
import { useAtom } from 'jotai';
import { readPrefixUnusedByLanguage } from '@/api/prefix/read-prefix-unused-by-language';
import { snippetTypeOptions } from '@/components/modals/AddSnippetModal';
import TagInput from '@/components/modals/TagInput';

interface PrefixForm extends PrefixRequestBody {}

function AddPrefixModal() {
  const [, setIsOpen] = useAtom(isAddPrefixModalVisibleAtom);
  const [selectedLang] = useAtom(selectedLangAtom);
  const [languages] = useAtom(languagesAtom);
  const [, setUnusedPrefixesByLanguage] = useAtom(unusedPrefixesByLanguageAtom);

  const [snippetLanguagesInput, setSnippetLanguagesInput] =
    useState<string>('');
  const [snippetLanguages, setSnippetLanguages] = useState<string[]>([]);

  const [prefixNameInputValue, setPrefixNameInputValue] = useState('');

  const FORM_FIELDS = {
    PREFIX_DESCRIPTION: 'prefix_description',
    PREFIX_NAMES: 'prefix_names',
    SNIPPET_TYPE_ID: 'snippet_type_id',
    PREFIX_LANGUAGE: 'prefix_language',
  } as const;

  const [formData, setFormData] = useState<PrefixForm>({
    [FORM_FIELDS.PREFIX_DESCRIPTION]: '',
    [FORM_FIELDS.PREFIX_NAMES]: [],
    [FORM_FIELDS.SNIPPET_TYPE_ID]: 1,
    [FORM_FIELDS.PREFIX_LANGUAGE]: snippetLanguages,
  });

  // Use useRef to manage focus on the input element
  const prefixDescriptionInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === FORM_FIELDS.PREFIX_DESCRIPTION) {
      setFormData({ ...formData, [name]: value });
    }

    if (name === FORM_FIELDS.PREFIX_NAMES) {
      setPrefixNameInputValue(() => {
        return value;
      });
    }

    if (name === FORM_FIELDS.SNIPPET_TYPE_ID) {
      setFormData({ ...formData, [name]: Number(value) });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ESCAPE: boolean = e.key === 'Escape';

    if (
      formData.prefix_description === '' &&
      prefixNameInputValue === '' &&
      formData.prefix_names.length === 0
    ) {
      if (ESCAPE) {
        setIsOpen(false);
      }
    }

    const isPrefixNamesInputFocused =
      document.activeElement === prefixDescriptionInputRef.current;

    if (
      !isPrefixNamesInputFocused &&
      prefixNameInputValue.trim() !== '' &&
      (e.key === 'Enter' || e.key === 'Tab')
    ) {
      e.preventDefault();

      const isPrefixNameAlreadySelected: boolean = !formData.prefix_names.some(
        (item) => item.prefix_name === prefixNameInputValue.trim(),
      );

      if (isPrefixNameAlreadySelected) {
        const prefixNamesMutated = formData.prefix_names;
        prefixNamesMutated.push({
          is_default: prefixNamesMutated.length === 0 ? true : false,
          prefix_name: prefixNameInputValue.trim(),
        });

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            prefix_names: prefixNamesMutated,
          };
        });
        setPrefixNameInputValue('');
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { prefix_description, prefix_names } = formData;

    const isThereSelectedPrefixNames: boolean = prefix_names.length > 0;

    if (
      prefix_description &&
      (prefixNameInputValue.trim() || isThereSelectedPrefixNames)
    ) {
      let data: typeof formData = {
        prefix_description: '',
        prefix_names: [],
        snippet_type_id: 1,
        prefix_language: snippetLanguages,
      };

      if (prefixNameInputValue.trim() && !isThereSelectedPrefixNames) {
        data = {
          prefix_description: formData.prefix_description,
          prefix_names: [
            {
              is_default: true,
              prefix_name: prefixNameInputValue.trim(),
            },
          ],
          snippet_type_id: formData.snippet_type_id,
          prefix_language: snippetLanguages,
        };
      }

      if (isThereSelectedPrefixNames) {
        data = {
          ...formData,
          ...{
            prefix_language: snippetLanguages,
          },
        };
      }
      try {
        createPrefix(data);

        if (selectedLang) {
          readPrefixUnusedByLanguage(selectedLang)
            .then((result) => {
              if (result) {
                setUnusedPrefixesByLanguage({
                  [selectedLang]: result,
                });
              }
            })
            .catch(() => {});
        }
        // setIsOpen(false);
      } catch (error) {
        console.error('Error creating prefix:', error);
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

  useEffect(() => {
    setFormData({
      prefix_description: '',
      prefix_names: [],
      snippet_type_id: 1,
      prefix_language: [],
    });
    if (prefixDescriptionInputRef.current) {
      prefixDescriptionInputRef.current.focus();
    }
  }, []);

  const removeWord = (prefixName: string) => {
    const prefixNamesMutated = formData.prefix_names.filter(
      (item) => item.prefix_name !== prefixName,
    );

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        prefix_names: prefixNamesMutated,
      };
    });
  };

  return (
    <>
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-stone-900 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
          <h1 className="text-lg font-bold text-white">Add Prefix</h1>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <label
              htmlFor="prefix_description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <input
              ref={prefixDescriptionInputRef}
              placeholder="e.g. String Variable"
              required
              type="text"
              name="prefix_description"
              id="prefix_description"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
            />

            <label
              htmlFor="prefix_description"
              className="block text-sm font-medium text-gray-300"
            >
              Prefix names
            </label>
            <input
              type="text"
              name="prefix_names"
              id="prefix_names"
              value={prefixNameInputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. varString"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="">
              {formData.prefix_names.map((word, index) => (
                <div
                  key={index}
                  className="inline-flex mt-5 m-1 items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
                >
                  {word.prefix_name}
                  <button
                    type="button"
                    onClick={() => removeWord(word.prefix_name)}
                    className="bg-blue-200 ml-2 rounded-full p-1 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

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
              {Object.entries(snippetTypeOptions).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>

            {formData.snippet_type_id === 2 && (
              <div className="space-y-1">
                <label
                  htmlFor="snippet_type_id"
                  className="text-sm font-medium text-gray-300"
                >
                  Specific languages
                </label>
                <TagInput
                  placeholder="Enter languages"
                  inputValue={snippetLanguagesInput}
                  setInputValue={setSnippetLanguagesInput}
                  addedValues={snippetLanguages}
                  onAddValue={(newTags: string[]) => {
                    setSnippetLanguages(newTags);
                  }}
                  suggestions={languages?.map(
                    (language) => language.language_name,
                  )}
                />
              </div>
            )}

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

export default AddPrefixModal;
