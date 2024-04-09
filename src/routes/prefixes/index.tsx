import { readPrefix } from '@/api/prefix/read-prefix';
import AddPrefixModal from '@/components/modals/AddPrefixModal';
import Prefixes from '@/components/prefix/Prefixes';
import { PrefixResponse } from '@/types';
import { createFileRoute } from '@tanstack/react-router';

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
  const prefixes = Route.useLoaderData();

  /* prettier-ignore */ (() => { const QuickLog = JSON.stringify(prefixes, null, 4); const parentDiv = document.getElementById('quicklogContainer') || (() => {const div = document.createElement('div');div.id = 'quicklogContainer';div.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end;';document.body.appendChild(div);return div; })(); const createChildDiv = (text: typeof QuickLog) => {const newDiv = Object.assign(document.createElement('div'), { textContent: text, style: 'font: bold 25px "Comic Sans MS"; width: max-content; max-width: 500px; word-wrap: break-word; background-color: rgb(255, 240, 0); box-shadow: white 0px 0px 5px 1px; padding: 5px; border: 3px solid black; border-radius: 10px; color: black !important; cursor: pointer;',});const handleMouseDown = (e: MouseEvent) => { e.preventDefault(); const clickedDiv = e.target instanceof Element && e.target.closest('div');if (clickedDiv !== null && e.button === 0 && clickedDiv === newDiv) { const textArea = document.createElement('textarea'); textArea.value = clickedDiv.textContent ?? ''; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);clickedDiv.style.backgroundColor = 'green'; setTimeout(() => { clickedDiv.style.backgroundColor = 'rgb(255, 240, 0)'; }, 1000); }};const handleRightClick = (e: MouseEvent) => { e.preventDefault(); if (parentDiv.contains(newDiv)) { parentDiv.removeChild(newDiv); }};newDiv.addEventListener('mousedown', handleMouseDown);newDiv.addEventListener('contextmenu', handleRightClick);return newDiv; };parentDiv.prepend(createChildDiv(QuickLog)); })()

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          All Prefixes
        </h1>
      </div>
      <div className="flex items-center justify-center pb-10">
        <AddPrefixModal />
      </div>
      <Prefixes />
    </>
  );
}
