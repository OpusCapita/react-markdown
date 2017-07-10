import { italicMark } from './ItalicUtils';


const ItalicKeyboardShortcut = (event, data, state) => {
  if (data.isMod && !event.shiftKey && data.key === 'i') {
    return italicMark(state);
  }
  return undefined;
};

export default ItalicKeyboardShortcut;
