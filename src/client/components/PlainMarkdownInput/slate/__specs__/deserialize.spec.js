/* eslint-disable max-len */

import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import deserialize from '../deserialize';

describe('plain editor deserialize', () => {
  it('deserialize', () => {
    const text1 = 'plain text';
    const text2 = '***bold italic text***';
    let state = deserialize(text1);
    expect(Plain.serialize(state)).to.equal(text1);
    state = deserialize(text2);
    expect(Plain.serialize(state)).to.equal(text2);
  });

  it('deserialize #2', () => {
    const text1 = `
plain text
plain text
plain text
`;
    let state = deserialize(text1);
    expect(Plain.serialize(state)).to.equal(text1);
  });

  it('the state is the deserialized text', () => {
    const text2 = '***bold italic text***';
    let state = deserialize(text2);
    expect(Plain.serialize(state)).to.equal(text2);

    let node = state.document.nodes.get(0);
    expect(node.type).to.equal('multiline');

    let characters = node.nodes.get(0).characters;
    expect(characters.size).to.equal(text2.length);

    let chars = [];
    for (let i = 0; i < characters.size; i++) {
      chars.push(characters.get(i).text);
    }
    expect(chars.join('')).to.equal(text2);
  });
});
