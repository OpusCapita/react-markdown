import { Raw } from '@opuscapita/slate';

export default string => {
  let raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: [{
        kind: 'block',
        type: 'multiline',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: string,
                marks: [],
              }
            ]
          }
        ]
      }]
    }
  };
  return Raw.deserialize(raw);
};
