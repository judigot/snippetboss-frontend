import { customFetch } from '@/api/customFetch';
import { language } from '@/types/types';

interface Body extends language {}

export const readLanguage = async (): Promise<Body[] | null> => {
  const result: Body[] | null = await customFetch.get({
    url: `/languages`,
  });
  return result;
};
