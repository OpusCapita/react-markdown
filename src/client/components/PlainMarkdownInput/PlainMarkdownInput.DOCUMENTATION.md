### Synopsis

PlainMarkdownInput

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| onChange                       | func                    | Callback: `(value) => {}`. Called when text is changed.     |
| onFullScreen                   | func                    | Callback: `(bool isFullSceen) => {}`                        |
| value                          | string                  | Raw markdown                                                |
| locale                         | string                  | Locale                                                      |
| autoFocus                      | bool                    | Set focus automatically on mount (default: true)            |
| readOnly                       | bool                    | Disables toolbar and makes markdown text not editable.      |

### Code Example

```
<PlainMarkdownInput
  autoFocus={false}
  onChange={_scope.handleValueChange}
  value={_scope.state.value}
/>
```

### Component Name

PlainMarkdownInput

### License

Licensed by © 2017 OpusCapita
