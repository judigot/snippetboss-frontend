import { atom } from 'jotai';

import { language, prefix, snippet_type } from '@/types';

export const languagesAtom = atom<language[] | null | undefined>(undefined);

export const prefixesAtom = atom<Record<string, prefix[]> | null | undefined>(
  undefined,
);

export const snippetTypesAtom = atom<snippet_type[] | null | undefined>(
  undefined,
);
