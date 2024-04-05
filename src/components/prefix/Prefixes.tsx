import { readPrefix } from '@/api/prefix/read-prefix';
import { readPrefixByLanguage } from '@/api/prefix/read-prefix-by-language';
import { prefixesAtom } from '@/state';
import { language } from '@/types';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

interface Props {
  language?: language;
}

export default function Prefixes({ language }: Props) {
  const [prefixes, setPrefixes] = useAtom(prefixesAtom);

  useEffect(() => {
    if (prefixes) {
      // Fetch data if all prefixes are not yet loaded
      if (!language && !('all' in prefixes)) {
        (async () => {
          const result = await readPrefix();
          if (result) {
            setPrefixes((prevState) => ({
              ...prevState,
              ...{ all: result },
            }));
          }
        })().catch(() => {});
      }

      // Fetch data if language-specific prefixes are not yet loaded
      if (language && !(language.language_name in prefixes)) {
        (async () => {
          const result = await readPrefixByLanguage(language.language_name);
          if (result) {
            setPrefixes((prevState) => ({
              ...prevState,
              ...{ [language.language_name]: result },
            }));
          }
        })().catch(() => {});
      }
    }

    // Initial load
    if (prefixes === undefined) {
      (async () => {
        const result = !language
          ? await readPrefix()
          : await readPrefixByLanguage(language.language_name);
        if (result) {
          setPrefixes(() => {
            return language
              ? { [language.language_name]: result }
              : { all: result };
          });
        }
      })().catch(() => {});
    }
  }, [language, prefixes, setPrefixes]);

  const prefixData = (() => {
    if (prefixes) {
      if (language) {
        return prefixes[language.language_name];
      }
      return prefixes['all'];
    }
  })();

  return (
    <section style={{ textAlign: 'center' }}>
      {prefixData?.map(({ prefix_id, prefix_description, prefix_names }) => (
        <div className="pb-10" key={prefix_id}>
          <h2
            className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white"
            style={{ textAlign: 'center' }}
          >
            {
              prefix_names.find((prefix_name) => prefix_name.is_default)
                ?.prefix_name
            }{' '}
            (
            {prefix_names
              .filter((prefix_name) => !prefix_name.is_default)
              .map((prefix_name) => prefix_name.prefix_name)
              .join(', ')}
            )
          </h2>
          <p>{prefix_description}</p>
        </div>
      ))}
    </section>
  );
}
