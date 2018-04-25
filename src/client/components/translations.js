const translations = {
  en: {
    insertHeader: 'Insert header',
    insertLink: 'Insert link',
    numberedList: 'Numbered list',
    bulletedList: 'Bulleted list',
    bold: 'Bold (Ctrl + B)',
    italic: 'Italic (Ctrl + I)',
    strikethrough: 'Strikethrough (Ctrl + S)',
    noMatchesFound: 'No matches found',
    fullscreen: 'Fullscreen',
    Product: 'Product',
    Term: 'Term',
    Maximize: 'Maximize',
    Minimize: 'Minimize',
    searching: 'Searching'
  },
  de: {
    insertHeader: 'Kopfzeile einfügen',
    insertLink: 'Link einfügen',
    numberedList: 'Nummerierte Liste',
    bulletedList: 'Aufzählung',
    bold: 'Fett (Strg + B)',
    italic: 'Kursiv (Strg + I)',
    strikethrough: 'Durchgestrichen (Strg + S)',
    noMatchesFound: 'Keine Treffer gefunden',
    fullscreen: 'Vollbild',
    Product: 'Product',
    Term: 'Term',
    Maximize: 'Maximieren',
    Minimize: 'Minimieren',
    searching: 'Suchen'
  }
};

export default function getMessage(locale, key) {
  let translationExists = (translations[locale] && translations[locale][key]);

  if (!translationExists) {
    return translations['en'][key];
  }

  return translations[locale][key];
}
