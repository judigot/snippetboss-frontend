import React, { useState, useEffect } from 'react';

interface TagInputProps {
  placeholder?: string;
  values: string[];
  suggestions?: string[];
  onChange: (newTags: string[]) => void;
}

function TagInput({
  placeholder = 'Enter values',
  values,
  suggestions = [
    'Suggestion 1',
    'Suggestion 2',
    'Suggestion 3',
    'Suggestion 4',
  ],
  onChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(values);
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Define the state for showing suggestions

  useEffect(() => {
    setTags(values);
  }, [values]);

  useEffect(() => {
    // Filter to show only unselected options
    filterAndSetSuggestions(inputValue);
  }, [tags]); // Depend on tags to re-filter when they change

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      addTag(inputValue.trim());
      setInputValue(''); // Clear the input field after adding a tag
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setInputValue(input);
    filterAndSetSuggestions(input);
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onChange(newTags);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange(newTags);
  };

  const filterAndSetSuggestions = (input: string) => {
    if (input.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase()) &&
          !tags.includes(suggestion),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200); // Delay hiding to allow click event
  };

  return (
    <>
      <div
        className={`relative flex items-center px-3 py-2 rounded-md bg-gray-700 border ${isFocused ? 'border-blue-500 ring-blue-500' : 'border-gray-600'}`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-blue-700 text-white px-2 py-1 mr-2 rounded-full"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="text-white ml-2 hover:text-blue-500 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
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
      </div>
    </>
  );
}

export default TagInput;
