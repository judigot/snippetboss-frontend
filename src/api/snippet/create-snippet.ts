import { customFetch } from '@/api/customFetch';
import { snippet } from '@/types';

interface Body extends Omit<snippet, 'snippet_id'> {}

export const createSnippet = async (
  formData: Body,
): Promise<Body | undefined> => {
  const result: Body | undefined = await customFetch.post({
    url: `/snippets`,
    body: JSON.stringify(formData),
  });
  return result;
};
