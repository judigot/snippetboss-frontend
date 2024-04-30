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

  const FORM_FIELDS = {
    PREFIX_DESCRIPTION: 'prefix_description',
    PREFIX_NAMES: 'prefix_names',
    PREFIX_NAMES_RAW: 'prefix_names_raw',
    SNIPPET_TYPE: 'snippet_type',
    PREFIX_LANGUAGE: 'prefix_language',
    PREFIX_INPUT: 'prefix_input',
    TAG_INPUT: 'tag_input',
  } as const;

  const blankForm = {
    [FORM_FIELDS.PREFIX_DESCRIPTION]: '',
    [FORM_FIELDS.PREFIX_NAMES]: [],
    [FORM_FIELDS.PREFIX_NAMES_RAW]: [],
    [FORM_FIELDS.SNIPPET_TYPE]: snippetTypeOptions.GLOBAL,
    [FORM_FIELDS.PREFIX_LANGUAGE]: [],
    [FORM_FIELDS.PREFIX_INPUT]: '',
    [FORM_FIELDS.TAG_INPUT]: '',
  };

  const [formData, setFormData] = useState<
    PrefixForm & {
      [FORM_FIELDS.PREFIX_INPUT]: string;
      [FORM_FIELDS.PREFIX_NAMES_RAW]: string[];
      [FORM_FIELDS.SNIPPET_TYPE]: string;
      [FORM_FIELDS.TAG_INPUT]: string;
    }
  >(blankForm);

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
      setFormData((prev) => ({ ...prev, prefix_input: value }));
    }

    if (name === FORM_FIELDS.SNIPPET_TYPE) {
      value === '2' &&
        setTimeout(() => {
          (
            document.querySelector('#specific_languages') as HTMLElement | null
          )?.focus();
        }, 0);

      setFormData({ ...formData, [name]: value });
    }

    if (name === FORM_FIELDS.TAG_INPUT) {
      setFormData((prev) => ({ ...prev, tag_input: value }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ESCAPE: boolean = e.key === 'Escape';

    if (
      formData.prefix_description === '' &&
      formData.prefix_input === '' &&
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
      formData.prefix_input.trim() !== '' &&
      (e.key === 'Enter' || e.key === 'Tab')
    ) {
      e.preventDefault();

      const isPrefixNameAlreadySelected: boolean = !formData.prefix_names.some(
        (item) => item.prefix_name === formData.prefix_input.trim(),
      );

      if (isPrefixNameAlreadySelected) {
        const prefixNamesMutated = formData.prefix_names;
        prefixNamesMutated.push({
          is_default: prefixNamesMutated.length === 0 ? true : false,
          prefix_name: formData.prefix_input.trim(),
        });

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            prefix_names: prefixNamesMutated,
          };
        });
        setFormData((prev) => ({ ...prev, prefix_input: '' }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { prefix_input, prefix_description, prefix_names, prefix_names_raw } =
      formData;
    const isThereSelectedPrefixNames: boolean = prefix_names_raw.length > 0;
    const isPrefixInputFilled: boolean =
      prefix_input.trim() !== '' && !isThereSelectedPrefixNames;

    if (
      prefix_description &&
      (isPrefixInputFilled || isThereSelectedPrefixNames)
    ) {
      // Remove unnecessary properties & mutate prefix names at the same time
      let {
        prefix_input,
        prefix_names_raw: _,
        tag_input,
        ...data
      } = {
        ...formData,
        prefix_names: (() => {
          // Convert prefix names strings into object
          const prefixNamesMutated = prefix_names;
          prefix_names_raw.forEach((prefixName: string) => {
            prefixNamesMutated.push({
              is_default: prefixNamesMutated.length === 0 ? true : false,
              prefix_name: prefixName.trim(),
            });
          });
          return prefixNamesMutated;
        })(),
      };

      if (isPrefixInputFilled) {
        data = {
          ...formData,
          ...{
            prefix_names: [
              {
                is_default: true,
                prefix_name: prefix_input.trim(),
              },
            ],
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
        setIsOpen(false);
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
    setFormData(blankForm);
    if (prefixDescriptionInputRef.current) {
      prefixDescriptionInputRef.current.focus();
    }
  }, []);

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
            <TagInput
              id="prefix_names"
              required={true}
              placeholder="Add prefixes"
              inputValue={formData.prefix_input.trim()}
              onInputChange={handleChange}
              addedValues={formData.prefix_names_raw}
              onAddValue={(newTags: string[]) =>
                setFormData((prev) => ({
                  ...prev,
                  prefix_input: '',
                  prefix_names_raw: newTags,
                }))
              }
              suggestions={[]}
            />

            <label
              htmlFor="snippet_type"
              className="text-sm font-medium text-gray-300"
            >
              Snippet Type
            </label>
            <select
              id="snippet_type"
              name="snippet_type"
              value={formData.snippet_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(snippetTypeOptions).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>

            {formData.snippet_type === snippetTypeOptions.SPECIFIC && (
              <div className="space-y-1">
                <label
                  htmlFor="specific_languages"
                  className="text-sm font-medium text-gray-300"
                >
                  Specific languages
                </label>
                <TagInput
                  id="tag_input"
                  required={true}
                  placeholder="Add specific languages"
                  inputValue={formData.tag_input}
                  onInputChange={handleChange}
                  addedValues={formData.prefix_language}
                  onAddValue={(newTags: string[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      tag_input: '',
                      prefix_language: newTags,
                    }));
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
