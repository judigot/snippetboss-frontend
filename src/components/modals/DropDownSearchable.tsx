import { useState } from 'react';

export function DropDownSearchable() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const dropdownMenu = document.querySelector(
      '#dropdown-menu',
    ) as HTMLElement | null;
    if (!dropdownMenu) return;
    const items = dropdownMenu.querySelectorAll('a');
    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || '';
      item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  };

  return (
    <div className="relative group">
      <button
        id="dropdown-button"
        type="button"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        <span className="mr-2">Open Dropdown</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id="dropdown-menu"
        className={`absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 ${isOpen ? '' : 'hidden'}`}
      >
        <input
          id="search-input"
          className="block w-full px-4 py-2 text-gray-800 border rounded-md  border-gray-300 focus:outline-none"
          type="text"
          placeholder="Search items"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <a
          href="#"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
        >
          Uppercase
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
        >
          Lowercase
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
        >
          Camel Case
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
        >
          Kebab Case
        </a>
      </div>
    </div>
  );
}

export default DropDownSearchable;
