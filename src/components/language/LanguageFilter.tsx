import { language } from '@/types';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/snippets/$language')({
  loader: async () => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return fetch(`http://localhost:3000/api/v1/languages`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result: language[]) => result);
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: LanguageFilter,
});

export default function LanguageFilter() {
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

  const { language } = Route.useParams();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { value } = e.target;

    navigate({
      to: '/snippets/$language',
      params: { language: value },
    }).catch(() => {});
  };

  return (
    <form>
      <label htmlFor="selectInput">
        <select
          id="selectInput"
          name="selectInput"
          value={language}
          onChange={handleChange}
          aria-label="Select Dropdown"
        >
          <option value="">All languages</option>
          {languages &&
            languages?.map(({ language_id, display_name, language_name }) => (
              <option key={language_id} value={language_name}>
                {display_name}
              </option>
            ))}
        </select>
      </label>
      {languages?.length === 0 && <span>No languages</span>}
    </form>
  );
}
