### Synopsis

MarkdownInput

### Props Reference

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| onChange           | func            | Callback: `(value) => {}`                                                                        |
| value              | string          | Raw markdown                                                                                     |
| extensions         | array           | See "Extension definition" section bellow.                                                       |
| readOnly           | bool            | Disables toolbar and makes markdown text not editable.                                           |

### Extension definition

Configurable extensions with autocomplete for **products**, **terms**, etc.

| Name               | Type            | Description                                                                                      |
| ------------------ | :-------------- | ------------------------------------------------------------------------------------------------ |
| objectClassName    | string         | Object class name displayed on buttons ('Product', 'Term', etc.)                                 |
| specialCharacter   | string         | Is used for inserting it into plain markdown input on button ('Term', 'Product', etc.) click.   |
| color              | string         | Color of object reference element in rich markdown input.                                       |
| termRegex          | regex          | Is used to check if item can be inserted after caret position in plain markdown input.          |
| searchItems        | func           | Is used to search items by input term.                                                           |
| markdownText       | func           | Is used to get text for markdown input based on selected item.                            |

### Code Example

```
<div style={{ height: '70vh' }}>
  <MarkdownInput
    onChange={_scope.handleValueChange}
    value={_scope.state.markdownExample}
    readOnly={true}
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
          return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
        },
        markdownText(item) {
          return '#' + item._objectLabel;
        }
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
          return '$' + item._objectLabel;
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
