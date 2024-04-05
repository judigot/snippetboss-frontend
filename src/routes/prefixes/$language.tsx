import { readPrefixByLanguage } from '@/api/prefix/read-prefix-by-language';
import Prefixes from '@/components/prefix/Prefixes';
import { languagesAtom, selectedLangAtom } from '@/state';
import { PrefixResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';

export const Route = createFileRoute('/prefixes/$language')({
  loader: async ({ params: { language } }) => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return readPrefixByLanguage(language).then(
      (prefixes: PrefixResponse[] | null) => {
        return {
          selectedLanguage: language,
          prefixes,
        };
      },
    );
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },

  component: PrefixesRoute,
});

function PrefixesRoute() {
  const [languages] = useAtom(languagesAtom);
  const [selectedLang] = useAtom(selectedLangAtom);

  const selectedLangData = languages?.find((language) => {
    return language.language_name === selectedLang;
  });

  return (
    <>
      <div className="flex items-center justify-center pb-10">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {selectedLangData?.display_name} Prefixes
        </h1>
      </div>
      <Prefixes language={selectedLangData} />
    </>
  );
}
