import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'; // Now including useRef
import { PrefixRequestBody, createPrefix } from '@/api/prefix/create-prefix'; // Ensure this API function is correctly implemented

interface PrefixForm extends PrefixRequestBody {}

function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefixNames, setPrefixNames] = useState<string[]>([]);

  const [formData, setFormData] = useState<PrefixForm>({
    prefix_description: '',
    prefix_names: [],
  });

  // Use useRef to manage focus on the input element
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { prefix_description } = formData;

    const modifiedPrefixNames: PrefixRequestBody['prefix_names'] =
      prefixNames.map((prefix_name, index) => ({
        prefix_name,
        is_default: index === 0, // Mark the first prefix as default
      })) as unknown as PrefixRequestBody['prefix_names'];

    if (prefix_description && prefixNames.length > 0) {
      const dataToSend: PrefixRequestBody = {
        prefix_description,
        prefix_names: modifiedPrefixNames,
      };

      try {
        await createPrefix(dataToSend); // Adjust this call to your actual API function for creating a prefix
        setIsOpen(false); // Close modal on successful submission
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        Add Prefix
      </button>

      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-stone-900 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h1 className="text-lg font-bold text-white">Add Prefix</h1>

            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="prefix_description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <input
                  ref={inputRef}
                  placeholder="e.g. String Variable"
                  required
                  type="text"
                  name="prefix_description"
                  id="prefix_description"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleInputChange}
                />
                <MultiWordInput
                  prefixNames={prefixNames}
                  setPrefixNames={setPrefixNames}
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
      )}
    </>
  );
}

const MultiWordInput = ({
  prefixNames,
  setPrefixNames,
}: {
  prefixNames: string[];
  setPrefixNames: Dispatch<SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When the user presses Enter, add the current input value to the words array
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim() !== '') {
      e.preventDefault(); // Prevent form submission
      setPrefixNames([...prefixNames, inputValue.trim()]);
      setInputValue(''); // Clear the input field
    }
  };

  const removeWord = (index: number) => {
    setPrefixNames(prefixNames.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g. varString"
        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {prefixNames.map((word, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
        >
          {word}
          <button
            onClick={() => removeWord(index)}
            className="bg-blue-200 ml-2 rounded-full p-1 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Modal;
