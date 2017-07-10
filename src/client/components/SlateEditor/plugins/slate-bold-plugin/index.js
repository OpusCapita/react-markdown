import BoldSchema from './BoldSchema';
import BoldButton from './BoldButton';
import BoldKeyboardShortcut from './BoldKeyboardShortcut';

const BoldPlugin = options => ({
  schema: BoldSchema,

  onKeyDown(...args) {
    return BoldKeyboardShortcut(...args)
  },
});

export {
  BoldPlugin,
  BoldSchema,
  BoldButton,
};
