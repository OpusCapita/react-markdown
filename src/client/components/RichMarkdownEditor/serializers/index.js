import RichMarkdownDeserializer from './RichMarkdownDeserializer';
import RichMarkdownSerializer from './RichMarkdownSerializer';

const serialize = RichMarkdownSerializer.serialize.bind(RichMarkdownSerializer);
const deserialize = RichMarkdownDeserializer.deserialize;

export { serialize, deserialize };
