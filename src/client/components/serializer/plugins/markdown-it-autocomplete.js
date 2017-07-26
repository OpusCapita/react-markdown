'use strict';


export default
class MarkdownAutocomplete {
  constructor(rules = {}) {
    this.parseRules(rules);

    return this.pluginFunc.bind(this);
  }

  parseRules(rules) {
    this.rules = [];

    for (let rule of rules) {
      this.rules.push({
        regex: new RegExp(`^${rule.regex}\\b`),
        id: rule.id
      });
    }
  }

  pluginFunc(md) {
    const RULES = this.rules;

    function autocomplete(state) {
      let token,
        start = state.pos;

      const src = state.src.substr(start);

      for (let rule of RULES) {
        let match = rule.regex.exec(src);
        if (match) {
          token = state.push('autocomplete', 'autocomplete', 0);
          token.text = token.content = match[0];
          token.meta  = { id: rule.id };

          state.pos = start + token.text.length;

          return true;
        }
      }

      return false;
    }


    md.inline.ruler.after('emphasis', 'autocomplete', autocomplete);
  }
}
