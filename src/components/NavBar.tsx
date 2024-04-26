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
    <header className="bg-blue-900 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-300"
          >
            <span className="text-2xl font-bold">Snippetboss</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
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
