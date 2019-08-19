import { expect } from 'chai';

import { matchUnderCursor } from './utils';

describe('matchUnderCursor', () => {
  it('should find regexp match under cursor', () => {
    const regexp = /^\$(\w*)$/;

    const tests = [
      // returns match under cursor
      {
        args: { text: 'abc $def ghi $jkl mno', regexp, cursor: 5 },
        want: { match: '$def', start: 4, end: 8 }
      },
      {
        args: { text: 'abc $def ghi $jkl mno', regexp, cursor: 14 },
        want: { match: '$jkl', start: 13, end: 17 }
      },
      // move cursor left to right to test all cases
      ...('abc $def ghi'.split('').reduce((acc, ch, cursor) => {
        return [
          ...acc,
          {
            args: { text: 'abc $def ghi', regexp, cursor },
            ...(
              // if cursor is out of match then return empty match
              (cursor < 4 || cursor > 8) ?
                { want: { match: '', start: cursor, end: cursor } } :
                // if cursor is on (or on edges of) match then return match and its boundaries
                { want: { match: '$def', start: 4, end: 8 } }
            )
          }
        ]
      }, []))
    ]

    tests.forEach(({ args, want }) => {
      const got = matchUnderCursor(args)
      expect(got).to.deep.equal(want, `input: ${JSON.stringify(args)}`)
    })
  })
})
