### Synopsis

MarkdownInput

### Props Reference

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| onChange           | func            | Callback: `(value) => {}`                                                                        |
| onFullScreen       | func            | Callback: `(bool isFullSceen) => {}`                                                             |
| value              | string          | Raw markdown                                                                                     |
| locale             | string          | Locale                                                                                           |
| extensions         | array           | See "Extension definition" section bellow.                                                       |
| additionalButtons  | array           | See "Additional buttons definition" section bellow.                                              |
| autoFocus          | bool            | Set focus automatically on mount (default: true)                                                 |
| readOnly           | bool            | Disables toolbar and makes markdown text not editable.                                           |

### Extension definition

Configurable extensions with autocomplete for **products**, **terms**, etc.

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| objectClassName    | string          | Object class name displayed on buttons ('Product', 'Term', etc.)                                 |
| specialCharacter   | string          | Is used for inserting it into plain markdown input on button ('Term', 'Product', etc.) click.    |
| color              | string          | Color of object reference element in rich markdown input.                                        |
| termRegex          | regex           | Is used to check if item can be inserted after caret position in plain markdown input.           |
| searchItems        | func            | Is used to search items by input term.                                                           |
| markdownText       | func            | Is used to get text for markdown input based on selected item.                                   |

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
    value={_scope.state.markdownExample}
    autoFocus={false}
    readOnly={false}
    showFullScreenButton={true}
    hideToolbar={true}
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
        objectClassName: 'Product',
        specialCharacter: '#',
        color: '#9ed69e',
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
            <span style={isSelected ? { color: 'red' } : { color: 'green' }}>{item._objectLabel}</span>
          </div>
        )
      },
      {
        objectClassName: 'Term',
        specialCharacter: '$',
        color: '#f396c3',
        termRegex: /^\$(\w*)$/,
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
          return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
        },
        markdownText(item) {
          return '$' + item._objectLabel + ' ';
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
