import { customFetch } from '@/api/customFetch';
import { language, snippet } from '@/types';

export interface SnippetRequestBody {
  snippet: Omit<snippet, 'snippet_id'>;
  language: language[];
}

export const createSnippet = async (
  formData: SnippetRequestBody,
): Promise<SnippetRequestBody | undefined> => {
  const result: SnippetRequestBody | undefined = await customFetch.post({
    url: `/snippets`,
    body: JSON.stringify(formData),
  });
  return result;
};
