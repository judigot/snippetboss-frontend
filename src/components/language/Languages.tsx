import { useCallback, useEffect, useState } from 'react';
import { language } from '@/types';
import { readLanguage } from '@/api/language/read-language';
import CodeEditor from '@/components/snippet/Snippets';
import Prefixes from '@/components/prefix/Prefixes';
import { AddLanguageComponent } from '@/components/language/AddLanguageComponent';
import { languagesAtom } from '@/state';
import { useAtom } from 'jotai';
import { getLangFromURL } from '@/helpers';

export default function Languages() {
  const pagesKeys = {
    ALL_PREFIXES: 'ALL_PREFIXES',
    PREFIXES: 'PREFIXES',
    SNIPPETS: 'SNIPPETS',
  } as const;

  const pages: {
    [K in keyof typeof pagesKeys]: string;
  } = {
    [pagesKeys.ALL_PREFIXES]: 'All Prefixes',
    [pagesKeys.PREFIXES]: 'Prefixes',
    [pagesKeys.SNIPPETS]: 'Snippets',
  } as const;

  const DEFAULT_TITLE: string = 'SnippetMaster';

  const [languages, setLanguages] = useAtom(languagesAtom);

  const [selectedLang, setSelectedLang] = useState<language | null | undefined>(
    undefined,
  );

  const [currentPage, setCurrentPage] = useState<
    (typeof pages)[keyof typeof pages] | undefined
  >(undefined);

  const setURLParam = (language: string | undefined) => {
    if (typeof window === 'undefined') {
      return;
    }
    const newUrl = new URL(window.location.href);
    if (language === undefined) {
      newUrl.searchParams.delete('language');
      window.history.pushState({}, '', newUrl.toString());
      document.title = pages.ALL_PREFIXES;
      return;
    }
    newUrl.searchParams.set('language', language);
    window.history.pushState({}, '', newUrl.toString());
    document.title = language;
  };

  const getSelectedLanguageInfo = useCallback(
    (lang?: language[] | null | undefined): language | null => {
      const finalLang: language[] | null | undefined = lang ?? languages;

      const selected: language | undefined = finalLang?.filter(
        (language) => language.language_name === getLangFromURL(),
      )[0];

      if (!selected) {
        return null;
      }

      return selected;
    },
    [languages],
  );

  const changeLanguage = (language: string) => {
    setURLParam(language);
    setSelectedLang(() => getSelectedLanguageInfo());
  };

  useEffect(() => {
    const handTitleChange = () => {
      const languageInURL = getLangFromURL() ?? DEFAULT_TITLE;
      setCurrentPage(() =>
        getLangFromURL() === '' ? pages.PREFIXES : pages.SNIPPETS,
      );
      document.title = languageInURL;
    };

    if (languages === undefined) {
      void (async () => {
        const result = await readLanguage();
        if (result) {
          handTitleChange();
          setLanguages(() => result);
          const lang = getSelectedLanguageInfo(result);

          if (lang) {
            setSelectedLang(() => getSelectedLanguageInfo(result));
            return;
          }
          setCurrentPage(pages.ALL_PREFIXES);
          document.title = pages.ALL_PREFIXES;
        }
      })();
    }

    window.removeEventListener('popstate', handTitleChange);
    return () => {
      window.addEventListener('popstate', handTitleChange);
    };
  }, [
    languages,
    getSelectedLanguageInfo,
    pages.ALL_PREFIXES,
    pages.PREFIXES,
    pages.SNIPPETS,
    setLanguages,
  ]);

  return (
    <>
      <section style={{ textAlign: 'center' }}>
        <h1>Languages</h1>
        {languages &&
          languages?.map(({ language_id, display_name, language_name }) => (
            <button
              key={language_id}
              onClick={() => {
                changeLanguage(language_name);
                if (currentPage === pages.ALL_PREFIXES) {
                  setCurrentPage(pages.SNIPPETS);
                }
              }}
            >
              {display_name !== '' ? display_name : language_name}
            </button>
          ))}
        {!languages && <span>No languages</span>}
      </section>
      <hr />
      <div style={{ textAlign: 'center' }}>
        {currentPage !== pages.ALL_PREFIXES && selectedLang && (
          <>
            <a
              href="page"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(pages.ALL_PREFIXES);
                setSelectedLang(() => {
                  getSelectedLanguageInfo();
                  setURLParam(undefined);
                  return undefined;
                });
              }}
            >
              {pages.ALL_PREFIXES}
            </a>
            &nbsp;|&nbsp;
            <a
              href="page"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(pages.PREFIXES);
              }}
            >
              {pages.PREFIXES}
            </a>
            &nbsp;|&nbsp;
            <a
              href="page"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(pages.SNIPPETS);
              }}
            >
              {pages.SNIPPETS}
            </a>
          </>
        )}
      </div>

      {currentPage === pages.ALL_PREFIXES && <Prefixes />}

      {selectedLang && (
        <>
          {currentPage === pages.PREFIXES && (
            <Prefixes language={selectedLang} />
          )}
          {currentPage === pages.SNIPPETS && (
            <>{<CodeEditor language={selectedLang} />}</>
          )}
        </>
      )}
    </>
  );
}
