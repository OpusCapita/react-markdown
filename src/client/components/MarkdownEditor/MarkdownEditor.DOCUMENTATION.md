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
<div style={{ height: '70vh' }}>
  <MarkdownEditor
    onChange={_scope.handleValueChange}
    value={_scope.state.value}
  />
</div>
```

### Component Name

MarkdownEditor

### License

Licensed by © 2017 OpusCapita
