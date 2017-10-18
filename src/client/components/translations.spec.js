import { expect } from 'chai';
import getMessage from './translations';

describe('translations.js', () => {
  it('getMessage(locale, key)', () => {
    const key = 'insertHeader';
    const patternEn = 'Insert header';
    const patternDe = 'Kopfzeile einfügen';

    let res = getMessage('de', key);
    expect(res).to.equal(patternDe);

    res = getMessage('en', key);
    expect(res).to.equal(patternEn);

    res = getMessage('sp', key);
    expect(res).to.equal(patternEn);
  });
});
