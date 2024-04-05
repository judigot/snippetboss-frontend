import { selectedLangAtom } from '@/state';
import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';

function NavBar() {
  const [selectedLang] = useAtom(selectedLangAtom);
  const URL: string | undefined = (() => {
    if (selectedLang == undefined && selectedLang !== '') {
      return ``;
    }

    return `/${selectedLang}/`;
  })();

  return (
    <header className="bg-blue-900">
      {' '}
      {/* Dark blue background */}
      <nav className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-300"
          >
            <span className="text-2xl font-bold">Snippetboss</span>{' '}
            {/* Increased font size and boldness */}
          </Link>
          {/* Centered menu items */}
          <div className="hidden md:flex items-center space-x-4">
            {' '}
            {/* Adjusted spacing */}
            <Link
              className="text-white hover:text-blue-300"
              to={`/snippets${URL}`}
            >
              Snippets
            </Link>
            <Link
              className="text-white hover:text-blue-300"
              to={`/prefixes${URL}`}
            >
              Prefixes
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
