import { customFetch } from '@/api/customFetch';
import { PrefixResponse } from '@/types';

export const readPrefixUnusedByLanguage = async (
  language: string,
): Promise<PrefixResponse[] | null> => {
  const result: PrefixResponse[] | null = await customFetch.get({
    url: `/prefixes?unused-by-language=${language}`,
  });

  return result;
};
