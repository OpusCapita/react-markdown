import MarkdownIt from '../../../markdown-it/index';
import MarkdownItParser from './MarkdownItParser';
import { Raw } from 'slate'


const RichMarkdownDeserializer = {
  /**
   * Deserialize a markdown `string`.
   *
   * @param {String} markdownData
   * @param {Array} options
   *    example:
   *    options = [{ regex: '\\$(\\w+)', id: 'term'}, { regex: '\\#(\\w+)', id: 'product'}]
   *    markdownData = #code
   *            ->
   *    {
   *      "kind": "inline",
   *      "isVoid": false,
   *      "nodes": [{"kind": "text", "ranges": [{"text": "#code"}]}],
   *      "type": "autocomplete",
   *      "data": {"id": "product"}
   *    }
   *
   * @return {State} state
   *
   */

  deserialize(markdownData, options = []) {
    let nodes = null;

    if (markdownData === '') {
      nodes = MarkdownItParser.getDefaultNodes();
    } else {
      let eventTokens = MarkdownIt.parse(markdownData || '', {});
      const markdownItParser = new MarkdownItParser();
      nodes = markdownItParser.parse(eventTokens);
    }

    return Raw.deserialize({ nodes: nodes }, { terse: true });
  }
};

export default RichMarkdownDeserializer;
