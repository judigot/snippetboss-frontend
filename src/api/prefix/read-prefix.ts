import { customFetch } from '@/api/customFetch';
import { PrefixResponse } from '@/types';

export const readPrefix = async (): Promise<PrefixResponse[] | null> => {
  const result: PrefixResponse[] | null = await customFetch.get({
    url: `/prefixes`,
  });

  return result;
};
