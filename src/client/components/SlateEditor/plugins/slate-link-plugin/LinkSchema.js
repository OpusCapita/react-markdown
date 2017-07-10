import LinkNode from './LinkNode';

export default function (options) {
  return {
    nodes: {
      link: LinkNode(options)
    }
  };
}