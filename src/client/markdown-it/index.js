import MarkdownIt from 'markdown-it';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItDeflist from 'markdown-it-deflist';
import MarkdownItAbbr from './plugins/abbr';
import MarkdownItAnchor from './plugins/anchor';
import MarkdownItLineCounter from './plugins/line-counter';
// import MarkdownAutocomplete from './plugins/markdown-it-autocomplete';


const markdown = new MarkdownIt({
  breaks: true
});

markdown.
  use(MarkdownItSub).
  use(MarkdownItSup).
  use(MarkdownItIns).
  use(MarkdownItMark).
  use(MarkdownItAbbr).
  use(MarkdownItLineCounter).
  use(MarkdownItDeflist).
  use(MarkdownItAnchor);

// let options = [{ regex: '\\$(\\w+)', id: 'term'}, { regex: '\\#(\\w+)', id: 'product'}];
// const markdownAutocomplete = new MarkdownAutocomplete(options);
// markdown.use(markdownAutocomplete);


export default markdown;
