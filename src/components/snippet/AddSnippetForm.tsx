import React, { useEffect, useState } from 'react';

interface Props {
  closeFormCallback: (value: boolean) => void;
}

const prefixOptions = {
  'option 1': 'Option 1',
  'option 2': 'Option 2',
  'option 3': 'Option 3',
} as const;

const snippetTypeOptions = {
  specific: 'Global',
  global: 'Specific',
} as const;

interface FormData {
  prefixInput: (typeof prefixOptions)[keyof typeof prefixOptions] | undefined;
  snippetTypeInput:
    | (typeof snippetTypeOptions)[keyof typeof snippetTypeOptions]
    | undefined;
  snippetInput: string | undefined;
}

export default function Form({
  closeFormCallback: setIsAddSnippetVisible,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    snippetInput: undefined,
    snippetTypeInput: undefined,
    prefixInput: undefined,
  });

  const isAnyInputFilled = Object.values(formData).some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const isEveryInputFilled = Object.values(formData).every(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const [isSubmitButtonVisible, setIsSubmitButtonVisible] =
    useState<boolean>(false);

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
      [name]: checked ?? value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (isEveryInputFilled) {
      /* prettier-ignore */ (() => { const QuickLog = JSON.stringify(formData, null, 4); const parentDiv = document.getElementById('quicklogContainer') || (() => {const div = document.createElement('div');div.id = 'quicklogContainer';div.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000;';document.body.appendChild(div);return div; })(); const createChildDiv = (text: typeof QuickLog) => {const newDiv = Object.assign(document.createElement('div'), { textContent: text, style: 'font: bold 25px "Comic Sans MS"; width: max-content; max-width: 500px; word-wrap: break-word; background-color: rgb(255, 240, 0); box-shadow: white 0px 0px 5px 1px; padding: 5px; border: 3px solid black; border-radius: 10px; color: black !important; cursor: pointer;',});const handleMouseDown = (e: MouseEvent) => { e.preventDefault(); const clickedDiv = e.target instanceof Element && e.target.closest('div');if (clickedDiv !== null && e.button === 0 && clickedDiv === newDiv) { const textArea = document.createElement('textarea'); textArea.value = clickedDiv.textContent ?? ''; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);clickedDiv.style.backgroundColor = 'green'; setTimeout(() => { clickedDiv.style.backgroundColor = 'rgb(255, 240, 0)'; }, 1000); }};const handleRightClick = (e: MouseEvent) => { e.preventDefault(); if (parentDiv.contains(newDiv)) { parentDiv.removeChild(newDiv); }};newDiv.addEventListener('mousedown', handleMouseDown);newDiv.addEventListener('contextmenu', handleRightClick);return newDiv; };parentDiv.prepend(createChildDiv(QuickLog)); })()
    }
  };

  const handleKeyDown = (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLSelectElement>,
  ) => {
    const CTRL_ENTER: boolean = (e.metaKey || e.ctrlKey) && e.key === 'Enter';
    const ESCAPE: boolean = e.key === 'Escape';

    if (ESCAPE) {
      handleCloseSnippet();
    }
    if (CTRL_ENTER) {
      handleSubmit();
    }
  };

  const handleCloseSnippet = () => {
    if (isAnyInputFilled) {
      // eslint-disable-next-line no-alert
      if (confirm('Discard unsaved snippet?')) {
        setIsAddSnippetVisible(false);
      }
      return;
    }
    setIsAddSnippetVisible(false);
  };

  useEffect(() => {
    const snippetInput = document.querySelector(
      `#snippetInput`,
    ) as HTMLTextAreaElement;
    snippetInput.focus();
  }, []);

  useEffect(() => {
    setIsSubmitButtonVisible(isEveryInputFilled);
  }, [isEveryInputFilled, formData]);

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <label htmlFor="snippetInput">
        Snippet
        <br />
        <textarea
          id="snippetInput"
          name="snippetInput"
          value={formData.snippetInput}
          onChange={handleChange}
          aria-label="Textarea Input"
          spellCheck={false}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          style={{
            height: '100px',
            width: '500px',
            resize: 'none',
          }}
        />
      </label>
      <br />
      <br />
      <label htmlFor="prefixInput">
        Prefix
        <br />
        <select
          id="prefixInput"
          name="prefixInput"
          value={formData.prefixInput}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          aria-label="Select Dropdown"
        >
          <option value="">Select a prefix</option>
          {Object.entries(prefixOptions).map(([key, option]) => (
            <option key={key} value={key}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <label htmlFor="snippetTypeInput">
        Snippet Type
        <br />
        <select
          id="snippetTypeInput"
          name="snippetTypeInput"
          value={formData.snippetTypeInput}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          aria-label="Select Dropdown"
        >
          <option value="">Select a type</option>
          {Object.entries(snippetTypeOptions).map(([key, option]) => (
            <option key={key} value={key}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <br />
      {isSubmitButtonVisible && (
        <>
          <button type="submit">Submit</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      <button
        type="button"
        onClick={() => {
          handleCloseSnippet();
        }}
      >
        Cancel
      </button>
      <hr />
    </form>
  );
}
