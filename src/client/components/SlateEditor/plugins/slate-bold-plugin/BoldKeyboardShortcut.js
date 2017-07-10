import { boldMark } from './BoldUtils';


const BoldKeyboardShortcut = (event, data, state) => {
  if (data.isMod && data.key === 'b') {
    return boldMark(state);
  }
};

export default BoldKeyboardShortcut;
