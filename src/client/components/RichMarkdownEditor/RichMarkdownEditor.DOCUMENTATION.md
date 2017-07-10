### Synopsis

RichMarkdownEditor

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| onChange                       | func                    | Callback: `(value) => {}`. Called when text is changed.     |
| value                          | string                  | Raw markdown                                                |
| autocompletes                  | array                   | Markdown autocomplete                                       |
| autoCompletionLinks            | array                   | List of suggestions links                                   |

### Code Example

```
<RichMarkdownEditor
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

RichMarkdownEditor

### License

Licensed by © 2017 OpusCapita

