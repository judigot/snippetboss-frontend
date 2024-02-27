import Prefixes from '@/components/prefix/Prefixes';
import { languagesAtom, selectedLangAtom } from '@/state';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';

export const Route = createFileRoute('/prefixes/$language')({
  component: PrefixesRoute,
});

function PrefixesRoute() {
  const [languages] = useAtom(languagesAtom);
  const [selectedLang] = useAtom(selectedLangAtom);

  const selectedLangData = languages?.find((language) => {
    return language.language_name === selectedLang;
  });

  return <Prefixes language={selectedLangData} />;
}
