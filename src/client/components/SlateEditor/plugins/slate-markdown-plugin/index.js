import MarkdownItalicButton from './MarkdownItalicButton';
import MarkdownBoldButton from './MarkdownBoldButton';
import MarkdownStrikethroughButton from './MarkdownStrikethroughButton';
import MarkdownOrderedListButton from './MarkdownOrderedListButton';
import MarkdownUnorderedListButton from './MarkdownUnorderedListButton';
import MarkdownInlineCodeButton from './MarkdownInlineCodeButton';
import MarkdownBlockQuoteButton from './MarkdownBlockQuoteButton';
import MarkdownLinkButton from './MarkdownLinkButton';
import MarkdownHeaderOneButton from './MarkdownHeaderOneButton';
import MarkdownHeaderTwoButton from './MarkdownHeaderTwoButton';
import MarkdownHeaderThreeButton from './MarkdownHeaderThreeButton';
import MarkdownHeaderFourButton from './MarkdownHeaderFourButton';
import MarkdownHeaderFiveButton from './MarkdownHeaderFiveButton';
import MarkdownHeaderSixButton from './MarkdownHeaderSixButton';

import MarkdownPreviewSchema from './MarkdownPreviewSchema';


const MarkdownPreviewPlugin = options => ({
  schema: MarkdownPreviewSchema
});


export {
  MarkdownPreviewPlugin,
  MarkdownBoldButton,
  MarkdownItalicButton,
  MarkdownStrikethroughButton,
  MarkdownOrderedListButton,
  MarkdownUnorderedListButton,
  MarkdownInlineCodeButton,
  MarkdownBlockQuoteButton,
  MarkdownLinkButton,
  MarkdownHeaderOneButton,
  MarkdownHeaderTwoButton,
  MarkdownHeaderThreeButton,
  MarkdownHeaderFourButton,
  MarkdownHeaderFiveButton,
  MarkdownHeaderSixButton,
}
