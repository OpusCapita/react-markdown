import ListSchema from './ListSchema';
import OrderedListButton from './OrderedListButton';
import UnorderedListButton from './UnorderedListButton';

const ListPlugin = options => ({
  schema: ListSchema,

  // onKeyDown(...args) {
  //   return ListKeyboardShortcut(...args)
  // },
});


export {
  ListPlugin,
  ListSchema,
  OrderedListButton,
  UnorderedListButton
};
