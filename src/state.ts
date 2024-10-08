import { atom } from 'jotai';

import { PrefixResponse, language } from '@/types';

export const selectedLangAtom = atom<string | undefined>(undefined);

export const languagesAtom = atom<language[] | null | undefined>(undefined);

export const unusedPrefixesByLanguageAtom = atom<
  Record<string, PrefixResponse[]> | undefined
>(undefined);

export const snippetTypesAtom = atom<undefined>(undefined);

export const isAddLanguageModalVisibleAtom = atom<boolean>(false);
export const isAddPrefixModalVisibleAtom = atom<boolean>(false);
export const isAddSnippetModalVisibleAtom = atom<boolean>(false);
