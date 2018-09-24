### Synopsis

MarkdownInput

### Methods reference

| Name  | Description                                                                                                                                                             |
| ----  | ----                                                                                                                                                                    |
| focus | Force element focus. Can be useful in case of using within react-bootstrap Modal component with animation. Should be called as `onEntered` callback (on animation end). |

### Props reference

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| onChange           | func            | Callback: `(value) => {}`                                                                        |
| onFullScreen       | func            | Callback: `(bool isFullSceen) => {}`                                                             |
| value              | string          | Raw markdown                                                                                     |
| locale             | string          | Locale                                                                                           |
| extensions         | array           | See "Extension definition" section bellow.                                                       |
| additionalButtons  | array           | See "Additional buttons definition" section bellow.                                              |
| autoFocus          | bool            | Set focus automatically on mount (default: true). May not work within react-bootstrap modal. See `focus()` method.                                                 |
| readOnly           | bool            | Disables toolbar and makes markdown text not editable.                                           |
| hideToolbar        | bool            | Default: `false`. If `true`, input renders without a toolbar.                                           |
| render             | func            | Optional render function for advanced scenarios; look at PlainMarkdownInput source code for more info.      |

### Extension definition

Configurable extensions with autocomplete for **products**, **terms**, etc.

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| specialCharacter   | string          | Is used for inserting it into plain markdown input on button ('Term', 'Product', etc.) click.    |
| termRegex          | regex           | Is used to check if item can be inserted after caret position in plain markdown input.           |
| searchItems        | func            | Is used to search items by input term. **Must return a Promise**.                                |
| markdownText       | func            | Is used to get text for markdown input based on selected item. **You can use this function in order to add a trailing space, etc.** |
| renderItem         | func            | React component used to render an item in autocomplete box. Receives an `item` of the array returned by `searchItems` function, and `isSelected` boolean prop, indicating weither this item is currently selected. **If omitted, default render is used.** In order to mimic default look, assign `react-markdown--autocomplete-widget__item` class to a returned `div`, and if item is selected, add `react-markdown--autocomplete-widget__item--active` class also. |

### Additional button definition

Configurable buttons in toolbar.

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| iconElement        | React Element   |                                                                                                  |
| label              | string          | (optional) button text, usually in required language.                                            |
| handleButtonPress  | func            | (optional) See "handleButtonPress definition" section bellow.                                    |

### handleButtonPress definition

function (optional) that is called on when the user presses the button, the function gets the object as a parameter
(see description below) that contains the following info:

| Name                    | Type            | Description                                                                                 |
| ----------------------- | :-------------- | ------------------------------------------------------------------------------------------- |
| value                   | string          | Current markdown text inside the editor.                                                    |
| insertAtCursorPosition  | func            | function that accepts object {String, additional markup}                                    |
|                         |                 | that could be called to update current markdown by inserting new text at current            |
|                         |                 | cursor position, if position is not available, then text is added to the end of markdown .  |

### Code Example

```
<div style={{ height: '70vh' }}>
  <MarkdownInput
    onChange={_scope.handleValueChange}
    onBlur={() => console.log('blur')}
    value={_scope.state.markdownExample}
    autoFocus={false}
    readOnly={false}
    showFullScreenButton={true}
    hideToolbar={false}
    locale='en'
    additionalButtons={[
      {
        iconElement: (<i className="fa fa-search"></i>),
        handleButtonPress({ value, insertAtCursorPosition }) {
          setTimeout(() => {
            insertAtCursorPosition('#Product.new');
          }, 100);
        },
      },
      {
        handleButtonPress({ value, insertAtCursorPosition }) {
          insertAtCursorPosition('#Product.old');
        },
        label: 'Product'
      },
      {
        iconElement: (<i className="fa fa-search"></i>),
        handleButtonPress({ value, insertAtCursorPosition }) {
          insertAtCursorPosition('$Term.new');
        },
        label: 'Term'
      }
    ]}
    extensions={[
      {
        specialCharacter: '#',
        termRegex: /^\#(\w*)$/,
        searchItems(term) {
          const items = [
            {_objectLabel: 'a1'},
            {_objectLabel: 'a2'},
            {_objectLabel: 'a23'},
            {_objectLabel: 'b1'},
            {_objectLabel: 'ba2'},
            {_objectLabel: 'ba21'},
            {_objectLabel: 'ba222'},
            {_objectLabel: 'ba23'},
            {_objectLabel: 'ba24'},
            {_objectLabel: 'ba25'},
            {_objectLabel: 'ba255'},
            {_objectLabel: 'ba256'},
            {_objectLabel: 'ba257'}
          ];
          return new Promise(resolve => setTimeout(_ => resolve(items.filter(({ _objectLabel }) => _objectLabel.indexOf(term.substring(1)) === 0)), 1000));
        },
        markdownText(item) {
          return '#' + item._objectLabel + ' ';
        },
        renderItem: ({ item, isSelected }) => (
          <div
            className={`
              react-markdown--autocomplete-widget__item${isSelected ? ' react-markdown--autocomplete-widget__item--active' : ''}
            `}
          >
            <span>{item._objectLabel}</span>
          </div>
        )
      },
      {
        specialCharacter: '$',
        termRegex: /^\$(\w*|\[\w*\]?)$/,
        searchItems(term) {
          const termId = term.replace(/^\$(?:\[(\w*)\]|\[?(\w*))$/, '$1$2');
          const items = [
            {_objectLabel: 'a1'},
            {_objectLabel: 'a2'},
            {_objectLabel: 'a23'},
            {_objectLabel: 'b1'},
            {_objectLabel: 'ba2'},
            {_objectLabel: 'ba21'},
            {_objectLabel: 'ba222'},
            {_objectLabel: 'ba23'},
            {_objectLabel: 'ba24'},
            {_objectLabel: 'ba25'},
            {_objectLabel: 'ba255'},
            {_objectLabel: 'ba256'},
            {_objectLabel: 'ba257'}
          ];
          return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(termId)));
        },
        markdownText(item, term) {
          return term[1] === '[' ?
            '$[' + item._objectLabel + '] ' :
            '$' + item._objectLabel + ' ';
        }
      }
    ]}
  />
</div>

```

### Component Name

MarkdownInput

### License

Licensed by © 2017 OpusCapita
