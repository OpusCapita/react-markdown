import LinkSchema from './LinkSchema';
import LinkButton from './LinkButton';

const LinkPlugin = options => ({
  schema: LinkSchema(options),

  // onKeyDown(...args) {
  //   return LinkKeyboardShortcut(...args)
  // },
});

export {
  LinkPlugin,
  LinkSchema,
  LinkButton
}
