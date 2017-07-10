import StrikethroughSchema from './StrikethroughSchema';
import StrikethroughButton from './StrikethroughButton';
import StrikethroughKeyboardShortcut from './StrikethroughKeyboardShortcut';

const StrikethroughPlugin = options => ({
  schema: StrikethroughSchema,

  onKeyDown(...args) {
    return StrikethroughKeyboardShortcut(...args)
  },
});

export {
  StrikethroughPlugin,
  StrikethroughSchema,
  StrikethroughButton
};
