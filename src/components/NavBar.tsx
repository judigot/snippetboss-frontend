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
    <>
      <div>
        <Link to={`/snippets${URL}`}>Snippets</Link>
        <Link to={`/prefixes${URL}`}>All Prefixes</Link>
        <Link to="/snippetboss">Snippetboss</Link>
      </div>
      <hr />
    </>
  );
}

export default NavBar;
