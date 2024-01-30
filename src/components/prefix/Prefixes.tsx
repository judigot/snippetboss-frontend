import { readPrefix } from '@/api/prefix/read-prefix';
import { readPrefixByLanguage } from '@/api/prefix/read-prefix-by-language';
import { language, prefix } from '@/types/types';
import { useEffect, useState } from 'react';

interface Props {
  language?: language;
}

export default function Prefixes({ language }: Props) {
  const [prefixes, setPrefixes] = useState<prefix[] | null | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const result = !language
        ? await readPrefix()
        : await readPrefixByLanguage(language.language_name);
      if (result) {
        setPrefixes(result);
      }
    })().catch(() => {});
  }, [language]);

  return (
    <section style={{ textAlign: 'center' }}>
      <h1>{language?.display_name ?? 'All'} Prefixes</h1>
      {prefixes?.map(({ prefix_id, prefix_name, prefix_description }) => (
        <div key={prefix_id}>
          <h1>{prefix_name}</h1>
          <p>{prefix_description}</p>
        </div>
      ))}
    </section>
  );
}
