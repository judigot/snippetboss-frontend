import { customFetch } from '@/api/customFetch';
import { PrefixResponse } from '@/types';

export const readPrefixByLanguage = async (
  language?: string,
): Promise<PrefixResponse[] | null> => {
  const result: PrefixResponse[] | null = await customFetch.get({
    url: `/prefixes/${language}`,
  });

  return result;
};
