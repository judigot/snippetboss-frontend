import { customFetch } from '@/api/customFetch';
import { SnippetResponseType } from '@/types';

export const readPrefixByLanguage = async (
  language?: string,
): Promise<SnippetResponseType[] | null> => {
  const result: SnippetResponseType[] | null = await customFetch.get({
    url: `/prefixes/${language}`,
  });

  return result;
};
