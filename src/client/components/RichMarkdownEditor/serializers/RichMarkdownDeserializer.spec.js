import { expect } from 'chai';
import { deserialize } from './index';


describe('RichMarkdownDeserializer', () => {
  it("deserialize('')", () => {
    let res = deserialize('');

    const document = res.document;
    const node = document.get('nodes').get(0);

    expect(document.get('nodes').size).to.equal(1);
    expect(document.get('data').size).to.equal(0);
    expect(node.get('data').size).to.equal(0);
    expect(node.get('isVoid')).to.equal(false);
    expect(node.get('type')).to.equal('paragraph');
  });
});
