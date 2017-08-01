### Synopsis

MarkdownEditor

### Props Reference

| Name               | Type           | Description                                                 |
| ------------------ | :--------------| ----------------------------------------------------------- |
| onChange           | func           | Callback: `(value) => {}`                                   |
| value              | string         | Raw markdown                                                |
| mode               | string         | Open editor in mode: 'rich' or 'plain', by default 'rich'   |

### Code Example

```
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
      termRegex: /^\#(\w*)/,
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
```

### Component Name

MarkdownEditor

### License

Licensed by © 2017 OpusCapita
