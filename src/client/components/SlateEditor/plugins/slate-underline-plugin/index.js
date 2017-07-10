import UnderlineSchema from './UnderlineSchema';
import UnderlineButton from './UnderlineButton';

const UnderlinePlugin = options => ({
  schema: UnderlineSchema,

  // onKeyDown(...args) {
  //   return UnderlineKeyboardShortcut(...args)
  // },
});


export {
  UnderlineSchema,
  UnderlineButton,
  UnderlinePlugin
}
