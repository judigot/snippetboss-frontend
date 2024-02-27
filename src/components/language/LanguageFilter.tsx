import { readLanguage } from '@/api/language/read-language';
import { languagesAtom, selectedLangAtom } from '@/state';
import { language } from '@/types';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

interface URLParameters {
  language: string;
}

export default function LanguageFilter() {
  const routerState = useRouterState();
  const [, setSelectedLang] = useAtom(selectedLangAtom);

  const URLParams: URLParameters = routerState.matches[0]
    .params as URLParameters;

  const currentPage: string = routerState.location.pathname.split('/')[1];

  const navigate = useNavigate({ from: '/snippets/$language' });

  const [languages, setLanguages] = useAtom(languagesAtom);

  useEffect(() => {
    if (languages === undefined) {
      readLanguage()
        .then((result: language[] | null) => {
          if (result) setLanguages(result);
          return result;
        })
        .catch(() => {});
    }

    if (URLParams.language) {
      setSelectedLang(() => {
        return URLParams.language;
      });
    }
  }, [URLParams.language, languages, setLanguages, setSelectedLang]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { value } = e.target;

    setSelectedLang(() => {
      navigate({
        to: `/${currentPage}/$language/`,
        params: { language: value },
      }).catch(() => {});
      return value;
    });
  };

  return (
    <form>
      <label htmlFor="selectInput">
        {languages && (
          <select
            id="selectInput"
            name="selectInput"
            value={URLParams.language ?? ''}
            onChange={handleChange}
            aria-label="Select Dropdown"
          >
            <option value="">All languages</option>
            {languages?.map(({ language_id, display_name, language_name }) => (
              <option key={language_id} value={language_name}>
                {display_name}
              </option>
            ))}
          </select>
        )}
      </label>
      {languages?.length === 0 && <span>No languages</span>}
    </form>
  );
}
