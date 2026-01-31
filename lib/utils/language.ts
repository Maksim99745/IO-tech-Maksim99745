const ARABIC_REGEX = /[\u0600-\u06FF]/;
const ENGLISH_REGEX = /[a-zA-Z]/;

export const hasArabicText = (text?: string | null): boolean => {
  if (!text) return false;
  return ARABIC_REGEX.test(text);
};

export const hasEnglishText = (text?: string | null): boolean => {
  if (!text) return false;
  return ENGLISH_REGEX.test(text);
};

export const hasAnyArabic = (...texts: (string | null | undefined)[]): boolean => {
  return texts.some((text) => hasArabicText(text));
};

export const filterByLocale = <T>(
  items: T[],
  locale: string,
  getTextFields: (item: T) => (string | null | undefined)[]
): T[] => {
  if (locale !== 'en' && locale !== 'ar') {
    return items;
  }

  return items.filter((item) => {
    const fields = getTextFields(item);
    const hasArabic = hasAnyArabic(...fields);

    if (locale === 'en') {
      return !hasArabic;
    }

    if (locale === 'ar') {
      return hasArabic;
    }

    return true;
  });
};
