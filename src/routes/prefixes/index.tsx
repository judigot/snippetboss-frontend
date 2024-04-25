import { readPrefix } from '@/api/prefix/read-prefix';
import Prefixes from '@/components/prefix/Prefixes';
import { isAddPrefixModalVisibleAtom } from '@/state';
import { PrefixResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';

export const Route = createFileRoute('/prefixes/')({
  loader: async () => {
    // if (language === 'nonexistent') {
    //   throw notFound();
    // }

    return readPrefix().then((prefixes: PrefixResponse[] | null) => prefixes);
  },

  staleTime: 10_000, // Load new data after 10 seconds

  notFoundComponent: () => {
    return <h1>404</h1>;
  },
  component: PrefixesRoute,
});

function PrefixesRoute() {
  const prefixes: PrefixResponse[] = Route.useLoaderData();
  const [, setIsAddPrefixModalVisible] = useAtom(isAddPrefixModalVisibleAtom);

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          All Prefixes
        </h1>
      </div>
      <div className="flex items-center justify-center pb-10">
        <button
          type="button"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => setIsAddPrefixModalVisible(true)}
        >
          Add prefix
        </button>
      </div>
      <Prefixes prefixes={prefixes} />
    </>
  );
}
