import { customFetch } from '@/api/customFetch';
import { SnippetResponseType } from '@/types';

export const readSnippet = async (
  language: string,
): Promise<SnippetResponseType[] | null> => {
  const result: SnippetResponseType[] | null = await customFetch.get({
    url: `/snippets/${language}`,
  });

  return result;
};
