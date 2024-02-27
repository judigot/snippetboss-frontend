import { customFetch } from '@/api/customFetch';
import { SnippetResponse } from '@/types';

export const readSnippetByLanguage = async (
  language: string,
): Promise<SnippetResponse[] | null> => {
  const result: SnippetResponse[] | null = await customFetch.get({
    url: `/snippets/${language}`,
  });

  return result;
};
