import React, { FormEvent, useEffect, useState } from 'react'; // Import useRef
import { createLanguage } from '@/api/language/create-language';
import { language } from '@/types';
import { isAddLanguageModalVisibleAtom } from '@/state';
import { useAtom } from 'jotai';

function AddLanguageModal() {
  const [, setIsOpen] = useAtom(isAddLanguageModalVisibleAtom);

  interface LanguageForm extends Omit<language, 'language_id'> {}

  const [formData, setFormData] = useState<LanguageForm>({
    language_name: '',
    display_name: '',
  });

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { language_name, display_name } = formData;

    if (language_name && display_name !== null) {
      createLanguage(formData)
        .then(() => {
          setIsOpen(false); // Close modal on successful submission
        })
        .catch(() => {});
    }
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (
      e.target === e.currentTarget &&
      !formData.language_name &&
      !formData.display_name
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ESCAPE: boolean = e.key === 'Escape';

    if (formData.language_name === '' && formData.display_name === '') {
      if (ESCAPE) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    setFormData({
      language_name: '',
      display_name: '',
    });
    // Set focus on the language_name input when the modal opens
    // Use setTimeout to ensure the element is in the DOM and visible
    const inputElement = document.querySelector(
      '#language_name',
    ) as HTMLInputElement;
    if (inputElement) inputElement.focus();
  }, []); // Dependencies

  return (
    <>
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-stone-900 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
          <h1 className="text-lg font-bold text-white">Add Language</h1>

          <form
            className="flex flex-col space-y-4"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div>
              <label
                htmlFor="language_name"
                className="block text-sm font-medium text-gray-300"
              >
                Programming Language
              </label>
              <input
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                placeholder="e.g. javascript"
                required
                type="text"
                name="language_name"
                id="language_name"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-gray-300"
              >
                Display Name
              </label>
              <input
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                placeholder="e.g. JavaScript"
                required
                type="text"
                name="display_name"
                id="display_name"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
              />
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

export default AddLanguageModal;
