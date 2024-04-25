import TagInput from '@/components/modals/TagInput';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexRoute,
});

function IndexRoute() {
  return <App />;
}

import React, { useState } from 'react';

interface FormData {
  textInput: string;
  tagInput: string;
  tagInputValues: string[];
  textareaInput: string;
  selectInput: string;
  radioInput: string;
  checkboxInput1: boolean;
  checkboxInput2: boolean;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    textInput: '',
    textareaInput: '',
    tagInput: '',
    tagInputValues: [],
    selectInput: '',
    radioInput: 'radioOption1',
    checkboxInput1: false,
    checkboxInput2: false,
  });

  const selectOptions = {
    option1: 'Option 1',
    option2: 'Option 2',
    option3: 'Option 3',
  };

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
      [name]: type === 'checkbox' ? !!checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const areAllInputsFilled = Object.values(formData).every(
      (value) => value !== undefined && value !== null && value !== '',
    );

    if (areAllInputsFilled) {
      /* prettier-ignore */ (() => { const QuickLog = JSON.stringify(formData, null, 4); const parentDiv = document.getElementById('quicklogContainer') || (() => {const div = document.createElement('div');div.id = 'quicklogContainer';div.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end;';document.body.appendChild(div);return div; })(); const createChildDiv = (text: typeof QuickLog) => {const newDiv = Object.assign(document.createElement('div'), { textContent: text, style: 'font: bold 25px "Comic Sans MS"; width: max-content; max-width: 500px; word-wrap: break-word; background-color: rgb(255, 240, 0); box-shadow: white 0px 0px 5px 1px; padding: 5px; border: 3px solid black; border-radius: 10px; color: black !important; cursor: pointer;',});const handleMouseDown = (e: MouseEvent) => { e.preventDefault(); const clickedDiv = e.target instanceof Element && e.target.closest('div');if (clickedDiv !== null && e.button === 0 && clickedDiv === newDiv) { const textArea = document.createElement('textarea'); textArea.value = clickedDiv.textContent ?? ''; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);clickedDiv.style.backgroundColor = 'green'; setTimeout(() => { clickedDiv.style.backgroundColor = 'rgb(255, 240, 0)'; }, 1000); }};const handleRightClick = (e: MouseEvent) => { e.preventDefault(); if (parentDiv.contains(newDiv)) { parentDiv.removeChild(newDiv); }};newDiv.addEventListener('mousedown', handleMouseDown);newDiv.addEventListener('contextmenu', handleRightClick);return newDiv; };parentDiv.prepend(createChildDiv(QuickLog)); })()
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TagInput
        id="tagInput"
        required={true}
        placeholder="Add tags"
        inputValue={formData.tagInput}
        addedValues={formData.tagInputValues}
        setInputValue={(value: string) => {
          setFormData((prev) => ({ ...prev, tagInput: value }));
        }}
        onAddValue={(newTags: string[]) => {
          setFormData((prev) => ({
            ...prev,
            tagInputValues: newTags,
          }));
        }}
        suggestions={["a", "b", "c"]}
      />

      {/* Text Input */}
      <label htmlFor="textInput">
        Text Input:
        <input
          type="text"
          id="textInput"
          name="textInput"
          value={formData.textInput}
          onChange={handleChange}
          aria-label="Text Input"
        />
      </label>

      <br />

      {/* Textarea Input */}
      <label htmlFor="textareaInput">
        Textarea Input:
        <textarea
          id="textareaInput"
          name="textareaInput"
          value={formData.textareaInput}
          onChange={handleChange}
          aria-label="Textarea Input"
        />
      </label>

      <br />

      {/* Select Dropdown */}
      <label htmlFor="selectInput">
        Select Dropdown:
        <select
          id="selectInput"
          name="selectInput"
          value={formData.selectInput}
          onChange={handleChange}
          aria-label="Select Dropdown"
        >
          <option value="">Select an option</option>
          {Object.entries(selectOptions).map(([key, option]) => (
            <option key={key} value={key}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <br />

      {/* Radio Buttons */}
      <div>
        {Object.entries(selectOptions).map(([key, option]) => (
          <label key={key} htmlFor={`radio${key}`}>
            <input
              type="radio"
              id={`radio${key}`}
              name="radioInput"
              value={key}
              checked={formData.radioInput === key}
              onChange={handleChange}
              aria-label={`Select ${option}`}
            />
            {`Select ${option}`}
          </label>
        ))}
      </div>

      <br />

      {/* Checkboxes */}
      <div>
        {Object.entries(selectOptions).map(([key, option]) => (
          <label key={key} htmlFor={`checkbox${key}`}>
            <input
              type="checkbox"
              id={`checkbox${key}`}
              name={`checkbox${key}`}
              checked={!!formData[`checkbox${key}` as keyof FormData]} // Ensure boolean value
              onChange={handleChange}
              aria-label={`Toggle ${option}`}
            />
            {`Toggle ${option}`}
          </label>
        ))}
      </div>

      <br />

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
}
