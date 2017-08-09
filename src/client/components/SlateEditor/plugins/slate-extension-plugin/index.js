import ObjectReferenceButton from './ObjectReferenceButton';
import ObjectReferenceSchema from './ObjectReferenceSchema';


const ObjectReferencePlugin = options => ({
  schema: ObjectReferenceSchema(options)
});


export {
  ObjectReferencePlugin,
  ObjectReferenceButton
}
