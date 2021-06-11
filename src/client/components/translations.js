const translations = {
  en: {
    "common.PlainMarkdownInput.insertHeader": 'Insert header',
    "common.PlainMarkdownInput.insertLink": 'Insert link',
    "common.PlainMarkdownInput.numberedList": 'Numbered list',
    "common.PlainMarkdownInput.bulletedList": 'Bulleted list',
    "common.PlainMarkdownInput.bold": 'Bold (Ctrl + B)',
    "common.PlainMarkdownInput.italic": 'Italic (Ctrl + I)',
    "common.PlainMarkdownInput.strikethrough": 'Strikethrough (Ctrl + S)',
    "common.PlainMarkdownInput.noMatchesFound": 'No matches found',
    "common.PlainMarkdownInput.fullscreen": 'Fullscreen',
    "common.PlainMarkdownInput.Product": 'Product',
    "common.PlainMarkdownInput.Term": 'Term',
    "common.PlainMarkdownInput.Maximize": 'Maximize',
    "common.PlainMarkdownInput.Minimize": 'Minimize',
    "common.PlainMarkdownInput.searching": 'Searching'
  },
  de: {
    "common.PlainMarkdownInput.insertHeader": 'Kopfzeile einfügen',
    "common.PlainMarkdownInput.insertLink": 'Link einfügen',
    "common.PlainMarkdownInput.numberedList": 'Nummerierte Liste',
    "common.PlainMarkdownInput.bulletedList": 'Aufzählung',
    "common.PlainMarkdownInput.bold": 'Fett (Strg + B)',
    "common.PlainMarkdownInput.italic": 'Kursiv (Strg + I)',
    "common.PlainMarkdownInput.strikethrough": 'Durchgestrichen (Strg + S)',
    "common.PlainMarkdownInput.noMatchesFound": 'Keine Treffer gefunden',
    "common.PlainMarkdownInput.fullscreen": 'Vollbild',
    "common.PlainMarkdownInput.Product": 'Product',
    "common.PlainMarkdownInput.Term": 'Term',
    "common.PlainMarkdownInput.Maximize": 'Maximieren',
    "common.PlainMarkdownInput.Minimize": 'Minimieren',
    "common.PlainMarkdownInput.searching": 'Suchen'
  }
};

export default (locale, key) => translations[locale] && translations[locale][key] || translations['en'][key];

