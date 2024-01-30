import { customFetch } from '@/api/customFetch';
import { SnippetResponseType } from '@/types/types';

export const readPrefix = async (): Promise<SnippetResponseType[] | null> => {
  const result: SnippetResponseType[] | null = await customFetch.get({
    url: `/prefixes`,
  });

  return result;
};
