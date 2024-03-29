import { customFetch } from '@/api/customFetch';
import { SnippetResponse } from '@/types';

export const readSnippet = async (): Promise<SnippetResponse[] | null> => {
  const result: SnippetResponse[] | null = await customFetch.get({
    url: `/snippets`,
  });

  return result;
};
