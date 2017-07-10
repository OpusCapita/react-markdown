import ItalicSchema from './ItalicSchema';
import ItalicButton from './ItalicButton';
import ItalicKeyboardShortcut from './ItalicKeyboardShortcut';

const ItalicPlugin = options => ({
  schema: ItalicSchema,

  onKeyDown(...args) {
    return ItalicKeyboardShortcut(...args)
  },
});

export {
  ItalicPlugin,
  ItalicSchema,
  ItalicButton,
}
