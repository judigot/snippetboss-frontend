import React, { useState, useEffect } from 'react';

interface TagInputProps {
  id: string;
  required: boolean;
  placeholder?: string;
  inputValue?: string;
  onInputChange: (newTags: string) => void;
  addedValues: string[];
  onAddValue: (newTags: string[]) => void;
  suggestions?: string[];
}

function TagInput({
  id,
  required,
  placeholder = 'Enter values',
  inputValue = '',
  onInputChange,
  addedValues,
  suggestions = [
    'Suggestion 1',
    'Suggestion 2',
    'Suggestion 3',
    'Suggestion 4',
  ],
  onAddValue,
}: TagInputProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Define the state for showing suggestions

  useEffect(() => {
    // Filter to show only unselected options
    filterAndSetSuggestions(inputValue);
    setShowSuggestions(true);
  }, [inputValue, addedValues]); // Depend on tags to re-filter when they change

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addValue(inputValue.trim());
      onInputChange(''); // Clear the input field after adding a tag
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onInputChange(input);
  };

  const addValue = (tag: string) => {
    if (!addedValues.includes(tag)) {
      const newTags = [...addedValues, tag];
      onAddValue(newTags);
    }
  };

  const removeValue = (index: number) => {
    const newTags = addedValues.filter((_, i) => i !== index);
    onAddValue(newTags);
  };

  const filterAndSetSuggestions = (input: string) => {
    if (input.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase()) &&
          !addedValues.includes(suggestion),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addValue(suggestion);
    onInputChange('');
    (document.querySelector(`#${id}`) as HTMLElement | null)?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 100); // Delay hiding to allow click event
  };

  return (
    <div
      key={id}
      className={`relative flex items-center px-3 py-2 rounded-md bg-gray-700 border ${isFocused ? 'border-blue-500 ring-blue-500' : 'border-gray-600'}`}
    >
      {addedValues.map((value, index) => (
        <span
          key={`${id}-${index}`}
          className="flex items-center bg-blue-700 text-white px-2 py-1 mr-2 rounded-full"
        >
          {value}
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="text-white ml-2 hover:text-blue-500 focus:outline-none"
          >
            &times;
          </button>
        </span>
      ))}

      <input
        required={addedValues.length === 0 && required} // Remove required if values are already added
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 bg-transparent text-white outline-none"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 top-full mt-1 w-full bg-gray-600 rounded shadow-lg z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer text-white hover:bg-gray-500 first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <p>{(addedValues.length > 0).valueOf()}</p>
    </div>
  );
}

export default TagInput;
