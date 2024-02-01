export const getLangFromURL = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const language = (searchParams.get('language') ?? '') || ''; // Default to an empty string if parameter is not present
  return language;
};
