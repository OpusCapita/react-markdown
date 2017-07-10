import StateRender from './StateRender';


const hasOwnProperty = Object.prototype.hasOwnProperty;

const assign = Object.assign || function (obj) {
    for (let i = 1; i < arguments.length; i++) {
      let target = arguments[i];
      for (let key in target) {
        if (hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }
    return obj;
  };


let defaults = {
  silent: false,
};

const MDParser = {
  parse(src, options) {
    options = assign({}, defaults, options);
    let fragment = null;

    try {
      fragment = StateRender.render(src);
    }

    catch (e) {
      if (options.silent) {
        fragment = [{
          kind: "block",
          type: "paragraph",
          nodes: [
            {
              kind: "text",
              ranges: [
                {
                  text: "An error occured:"
                },
                {
                  text: e.message
                }
              ]
            }
          ]
        }];
      } else {
        throw e;
      }
    }

    return {nodes: fragment};
  },
};

export default MDParser;