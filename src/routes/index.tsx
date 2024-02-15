import { readLanguage } from '@/api/language/read-language';
import { languagesAtom } from '@/state';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [languages, setLanguages] = useAtom(languagesAtom);
  useEffect(() => {
    if (languages === undefined) {
      void (async () => {
        const result = await readLanguage();
        if (result) {
          /* prettier-ignore */ (() => { const QuickLog = JSON.stringify(result, null, 4); const parentDiv = document.getElementById('quicklogContainer') || (() => {const div = document.createElement('div');div.id = 'quicklogContainer';div.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000;';document.body.appendChild(div);return div; })(); const createChildDiv = (text: typeof QuickLog) => {const newDiv = Object.assign(document.createElement('div'), { textContent: text, style: 'font: bold 25px "Comic Sans MS"; width: max-content; max-width: 500px; word-wrap: break-word; background-color: rgb(255, 240, 0); box-shadow: white 0px 0px 5px 1px; padding: 5px; border: 3px solid black; border-radius: 10px; color: black !important; cursor: pointer;',});const handleMouseDown = (e: MouseEvent) => { e.preventDefault(); const clickedDiv = e.target instanceof Element && e.target.closest('div');if (clickedDiv !== null && e.button === 0 && clickedDiv === newDiv) { const textArea = document.createElement('textarea'); textArea.value = clickedDiv.textContent ?? ''; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);clickedDiv.style.backgroundColor = 'green'; setTimeout(() => { clickedDiv.style.backgroundColor = 'rgb(255, 240, 0)'; }, 1000); }};const handleRightClick = (e: MouseEvent) => { e.preventDefault(); if (parentDiv.contains(newDiv)) { parentDiv.removeChild(newDiv); }};newDiv.addEventListener('mousedown', handleMouseDown);newDiv.addEventListener('contextmenu', handleRightClick);return newDiv; };parentDiv.prepend(createChildDiv(QuickLog)); })()
          setLanguages(() => result);
        }
      })();
    }
  }, [languages, setLanguages]);
  return <Navigate to="/snippets" />;
}
