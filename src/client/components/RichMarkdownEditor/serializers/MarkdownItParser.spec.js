import { expect } from 'chai';
import { deserialize, serialize } from './index';

// function compareJSONValues(value1, value2) {
//   expect(JSON.parse(JSON.stringify(value1))).to.deep.equal(value2);
// }


function reparser(str, isPrint = false) {
  const options = [
    { regex: '\\$(\\w+)', id: 'term' },
    { regex: '\\#(\\w+)', id: 'product' }
  ];

  let repars = serialize(deserialize(str, options));

  if (isPrint) {
    printData(str, repars);
  }

  return repars;
}

function trimStr(str) {
  const arrStr = str.split('\n');
  for (let i = 0; i < arrStr.length; i++) {
    arrStr[i] = arrStr[i].trimRight();
  }

  return arrStr.join('\n');
}

/**
 * Function printData is used for tests' debugging
 *
 * @param {String} str
 * @param {String} repars
 */

function printData(str, repars) {
  console.log('str:');
  console.log(str);
  console.log('----------------');
  console.log(' ');
  console.log('repars:');
  console.log(repars);
  console.log('----------------');
  console.log(' ');
}


describe('MarkdownItParser', () => {
  describe('Lists', () => {
    it('Unordered list (5 levels)', () => {
      let str = `## Lists
Unordered

End list`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });
});
