import { customFetch } from '@/api/customFetch';

export interface PrefixRequestBody {
  prefix_description: string;
  prefix_names: {
    prefix_name: string;
    is_default: boolean;
  }[];
  snippet_type_id: number;
  prefix_language: string[];
}

export const createPrefix = async (
  formData: PrefixRequestBody,
): Promise<PrefixRequestBody | undefined> => {
  const result: PrefixRequestBody | undefined = await customFetch.post({
    url: `/prefixes`,
    body: JSON.stringify(formData),
  });
  return result;
};
