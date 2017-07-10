import BlockquoteSchema from './BlockquoteSchema'
import BlockquoteButton from './BlockquoteButton'


const BlockquotePlugin = options => ({
  schema: BlockquoteSchema
});

export {
  BlockquotePlugin,
  BlockquoteSchema,
  BlockquoteButton,
}
