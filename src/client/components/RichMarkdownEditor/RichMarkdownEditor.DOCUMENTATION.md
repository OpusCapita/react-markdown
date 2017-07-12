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
/>
```

### Component Name

RichMarkdownEditor

### License

Licensed by © 2017 OpusCapita
