import React, { useState, useEffect } from 'react';

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
}: {
  id: string;
  required: boolean;
  placeholder?: string;
  inputValue?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addedValues: string[];
  onAddValue: (newTags: string[]) => void;
  suggestions?: string[];
}) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Define the state for showing suggestions

  useEffect(() => {
    // Filter to show only unselected options
    filterAndSetSuggestions(inputValue);
    setShowSuggestions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, addedValues]); // Depend on tags to re-filter when they change

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addValue(inputValue.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
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
    (document.querySelector(`#${id}`) as HTMLElement).focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200); // Delay hiding to allow click event
  };

  return (
    <div
      key={id}
      className={`relative flex items-center flex-wrap gap-2 px-3 py-2 rounded-md bg-gray-700 border ${isFocused ? 'border-blue-500 ring-blue-500' : 'border-gray-600'}`}
    >
      {addedValues.map((value, index) => (
        <span
          key={`${id}-${String(index)}`}
          className="flex items-center bg-blue-700 text-white rounded-full text-sm px-2 py-1 mr-2"
        >
          {value}
          <button
            type="button"
            onClick={() => {
              removeValue(index);
            }}
            className="bg-blue-700 hover:bg-blue-500 rounded-full ml-2 inline-flex items-center justify-center w-6 h-6"
            aria-label={`Remove ${value}`}
          >
            &times;
          </button>
        </span>
      ))}

      <input
        required={addedValues.length === 0 && required}
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 bg-transparent text-white outline-none min-w-[100px] basis-[100px]"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 top-full mt-1 w-full bg-gray-600 rounded shadow-lg z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer text-white hover:bg-gray-500 rounded-t-md first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                handleSuggestionClick(suggestion);
              }}
              onKeyDown={() => {}}
              role="option"
              tabIndex={0} // tabIndex="0" makes the div focusable
              aria-label="Close modal" // Provides a label that describes the button's action
              aria-selected={false} // Provides a label that describes the button's action
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagInput;
