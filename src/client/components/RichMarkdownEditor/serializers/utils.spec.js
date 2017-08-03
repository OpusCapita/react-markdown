import { expect } from 'chai';
import Utils from './utils'


describe('serializers/utils', () => {
  it('parseAttrs(attrs)', () => {
    const attrs = [
      ['title', 'google'],
      ['href', 'http://google.com']
    ];
    const res = Utils.parseAttrs(attrs);
    let target = {
      title: 'google',
      href: 'http://google.com'
    };
    expect(res).to.deep.equal(target);
  });

  it('getLastElemTokenType(token)', () => {
    let token = { type: 'link_open' };
    let res = Utils.getLastElemTokenType(token);
    expect(res).to.equal('open');

    token = { type: 'image' };
    res = Utils.getLastElemTokenType(token);
    expect(res).to.equal('image');
  });

  it("createArrayJoined(length, value, sep = '')", () => {
    const length = 3;
    const value = '|---';
    const sep = ',';
    const res = Utils.createArrayJoined(length, value, sep);
    expect(res).to.equal('|---,|---,|---');
  });
});
