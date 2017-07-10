### Synopsis

MarkdownEditor

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| onChange                       | func                    | Callback: `(value) => {}`                                   |
| value                          | string                  | Raw markdown                                                |
| autocompletes                  | array                   | Markdown autocomplete                                       |
| autoCompletionLinks            | array                   | List of suggestions links                                   |
| mode                           | string                  | Open editor in mode: 'rich' or 'plain', by default 'rich'   |

### Code Example

```
<MarkdownEditor
  onChange={_scope.handleValueChange}
  value={_scope.state.value}
  autocompletes={[
    {
      termRegex: /^\$(\w*)$/,
      fetch(term) {
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
          {_objectLabel: 'ba257'},
        ];
        return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
      },
      selectItem(item) {
        return '$' + item._objectLabel;
      }
    },
    {
      termRegex: /^\#(\w*)$/,
      fetch(term) {
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
          {_objectLabel: 'ba257'},
        ];
        return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
      },
      selectItem(item) {
        return '#' + item._objectLabel;
      }
    }
  ]}
/>
```

### Component Name

MarkdownEditor

### License

Licensed by © 2017 OpusCapita

