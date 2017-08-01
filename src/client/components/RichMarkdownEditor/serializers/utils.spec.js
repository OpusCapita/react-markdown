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

  it('assign(obj1, obj2, obj3)', () => {
    let assign = Object.assign;
    Object.assign = null;

    const obj1 = { type: 'link' };
    const obj2 = { href: 'http://google.com' };
    const res = Utils.assign(obj1, obj2);
    let target = {
      type: 'link',
      href: 'http://google.com'
    };
    expect(res).to.deep.equal(target);

    Object.assign = assign;
  });

  it('getLastElemTokenType(token)', () => {
    let token = { type: 'link_open' };
    let res = Utils.getLastElemTokenType(token);
    expect(res).to.equal('open');

    token = { type: 'image' };
    res = Utils.getLastElemTokenType(token);
    expect(res).to.equal('image');
  });

  it('flatten(arr)', () => {
    let arr = ['1', '2', ['3', '4'], '5'];
    let res = Utils.flatten(arr);
    expect(res).to.deep.equal(['1', '2', '3', '4', '5']);

    arr = ['1', '2', ['3', '4'], '5', 6, 7];
    res = Utils.flatten(arr);
    expect(res).to.deep.equal(['1', '2', '3', '4', '5', '', '']);
  });
});
