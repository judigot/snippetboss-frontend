import { customFetch } from '@/api/customFetch';
import { language, snippet } from '@/types';

export interface SnippetRequestBody {
  snippet: Omit<snippet, 'snippet_id'>;
  language: language[];
}

export const createSnippet = async (
  formData: Body,
): Promise<Body | undefined> => {
  const result: Body | undefined = await customFetch.post({
    url: `/snippets`,
    body: JSON.stringify(formData),
  });
  return result;
};
