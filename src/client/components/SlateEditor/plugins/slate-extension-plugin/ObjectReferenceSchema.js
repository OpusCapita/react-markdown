import ObjectReferenceNode from './ObjectReferenceNode';

export default function(options) {
  return {
    nodes: {
      objectReference: ObjectReferenceNode(options)
    }
  };
}
