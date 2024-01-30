import { customFetch } from '@/api/customFetch';
import { snippet } from '@/types/types';

interface Body
  extends Pick<snippet, 'snippet_id' | 'snippet_content'> {}

interface Response extends snippet {}

export const updateSnippet = async (
  formData: Body,
): Promise<Response> => {
  const result: Response = await customFetch.patch({
    url: `/snippets`,
    body: JSON.stringify(formData),
  });
  return result;
};
