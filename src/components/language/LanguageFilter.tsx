import { selectedLangAtom } from '@/state';
import { language } from '@/types';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';

interface URLParameters {
  language: string;
}

export default function LanguageFilter() {
  const routerState = useRouterState();
  const [selectedLang, setSelectedLang] = useAtom(selectedLangAtom);

  const URLParams: URLParameters = routerState.matches[0]
    .params as URLParameters;

  const currentPage: string = routerState.location.pathname.split('/')[1];

  const navigate = useNavigate({ from: '/snippets/$language' });

  const [languages, setLanguages] = useState<language[] | undefined>(undefined);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/languages`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result: language[]) => {
        setLanguages(result);
        return result;
      })
      .catch(() => {});
  }, []);

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
            value={selectedLang ?? URLParams.language}
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
