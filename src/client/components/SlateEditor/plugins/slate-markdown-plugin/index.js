import MarkdownItalicButton from './MarkdownItalicButton';
import MarkdownBoldButton from './MarkdownBoldButton';
import MarkdownStrikethroughButton from './MarkdownStrikethroughButton';
import MarkdownOrderedListButton from './MarkdownOrderedListButton';
import MarkdownUnorderedListButton from './MarkdownUnorderedListButton';
import MarkdownLinkButton from './MarkdownLinkButton';
import MarkdownHeaderOneButton from './MarkdownHeaderOneButton';
import MarkdownHeaderTwoButton from './MarkdownHeaderTwoButton';
import MarkdownHeaderThreeButton from './MarkdownHeaderThreeButton';
import MarkdownHeaderFourButton from './MarkdownHeaderFourButton';
import MarkdownHeaderFiveButton from './MarkdownHeaderFiveButton';
import MarkdownHeaderSixButton from './MarkdownHeaderSixButton';

import MarkdownSchema from './MarkdownSchema';
import MarkdownKeyboardShortcut from './MarkdownKeyboardShortcut';
import SplitListBlocksAutoHandler from './SplitListBlocksAutoHandler';


const MarkdownPlugin = options => ({
  schema: MarkdownSchema,

  onKeyDown(...args) {
    const result = SplitListBlocksAutoHandler(...args);

    if (result) {
      return result;
    }
    return MarkdownKeyboardShortcut(...args);
  },
});

export {
  MarkdownPlugin,
  MarkdownBoldButton,
  MarkdownItalicButton,
  MarkdownStrikethroughButton,
  MarkdownOrderedListButton,
  MarkdownUnorderedListButton,
  MarkdownLinkButton,
  MarkdownHeaderOneButton,
  MarkdownHeaderTwoButton,
  MarkdownHeaderThreeButton,
  MarkdownHeaderFourButton,
  MarkdownHeaderFiveButton,
  MarkdownHeaderSixButton,
}
