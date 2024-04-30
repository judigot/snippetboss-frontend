import { PrefixResponse } from '@/types';

interface Props {
  prefixes?: PrefixResponse[];
}

export default function Prefixes({ prefixes }: Props) {
  return (
    <section style={{ textAlign: 'center' }}>
      {prefixes?.map(({ prefix_id, prefix_description, prefix_names }) => (
        <div className="pb-10" key={prefix_id}>
          <h2
            className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white"
            style={{ textAlign: 'center' }}
          >
            {
              prefix_names.find((prefix_name) => prefix_name.is_default)
                ?.prefix_name
            }
            &nbsp;
            {prefix_names.length > 1 && (
              <>
                (
                {prefix_names
                  .filter((prefix_name) => !prefix_name.is_default)
                  .map((prefix_name) => prefix_name.prefix_name)
                  .join(', ')}
                )
              </>
            )}
          </h2>
          <p>{prefix_description}</p>
        </div>
      ))}
    </section>
  );
}
