export interface language {
  language_id: number;
  language_name: string;
  display_name: string;
}

export interface prefix {
  prefix_id: number;
  prefix_name: string;
  prefix_description: string;
}

export interface snippet_type {
  snippet_type_id: number;
  snippet_type_name: string;
}

export interface snippet {
  snippet_id: number;
  snippet_type_id: number;
  prefix_id: number;
  snippet_content: string;
}

export interface prefix_name {
  prefix_name_id: number;
  prefix_id: number;
  prefix_name: string;
  is_default: boolean;
}

export type SnippetResponseType = snippet &
  prefix & {
    languages: language[];
  };
