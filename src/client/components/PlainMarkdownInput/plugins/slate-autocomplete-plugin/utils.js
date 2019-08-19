export const matchUnderCursor = ({ text, regexp, cursor }) => {
  const result = {
    match: '',
    start: cursor,
    end: cursor
  }

  for (let start = cursor; start >= 0; start--) {
    for (let end = cursor; end <= text.length; end++) {
      const chunk = text.slice(start, end);
      if (regexp.test(chunk) && chunk.length > result.match.length) {
        result.match = chunk;
        result.start = start;
        result.end = end;
      }
    }
  }

  return result;
}
