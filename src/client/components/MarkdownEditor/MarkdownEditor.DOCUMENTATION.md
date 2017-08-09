### Synopsis

MarkdownEditor

### Props Reference

| Name               | Type           | Description                                                                                      |
| ------------------ | :--------------| ------------------------------------------------------------------------------------------------ |
| onChange           | func           | Callback: `(value) => {}`                                                                        |
| value              | string         | Raw markdown                                                                                     |
| mode               | string         | Open editor in mode: 'rich' or 'plain', by default 'rich'                                        |
| objectClassName    | string         | Object class name displayed on buttons ('Product', 'Term', etc.)                                 |
| specialCharacter   | string         | Is used for inserting it into plain markdown editor on button ('Term', 'Product', etc.) click.   |
| color              | string         | Color of object reference element in rich markdown editor.                                       |
| termRegex          | regex          | Is used to check if item can be inserted after caret position in plain markdown editor.          |
| searchItems        | func           | Is used to search items by input term.                                                           |
| plainMarkdownText  | func           | Is used to get text for plain markdown editor based on selected item.                            |
| richMarkdownText   | func           | Is used to get text for rich markdown editor based on selected item.                             |

### Code Example

```
<div style={{ height: '70vh' }}>
  <MarkdownEditor
    onChange={_scope.handleValueChange}
    value={_scope.state.value}
    extensions={[
      {
        objectClassName: 'Product',
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
        plainMarkdownText(item) {
          return '$' + item._objectLabel;
        },
        richMarkdownText(item) {
          return item._objectLabel;
        }
      },
      {
        objectClassName: 'Term',
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
        plainMarkdownText(item) {
          return '#' + item._objectLabel;
        },
        richMarkdownText(item) {
          return item._objectLabel;
        }
      }
    ]}
  />
</div>

```

### Component Name

MarkdownEditor

### License

Licensed by © 2017 OpusCapita
