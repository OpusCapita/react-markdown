### Synopsis

PlainMarkdownEditor

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| onChange                       | func                    | Callback: `(value) => {}`. Called when text is changed.     |
| value                          | string                  | Raw markdown                                                |
| autocompletes                  | object                  | Markdown autocomplete                                       |

### Code Example

```
<PlainMarkdownEditor 
  onChange={_scope.handleValueChange}
  value={_scope.state.value}
  autocompletes = {[{
     termRegex: /\$(\w*)$/,
     fetch: (term) => {
       switch(term) {
         case '$':
           return Promise.resolve([
             { _objectLabel: '1s' },
             { _objectLabel: '2f' },
             { _objectLabel: '2s' }
           ]);
         case '$1':
           return Promise.resolve([
             { _objectLabel: '1s' }
           ]);
         case '$2':
           return Promise.resolve([
             { _objectLabel: '2f' },
             { _objectLabel: '2s' }
           ]);
         default:
           return Promise.resolve([])
       }
     },
     selectItem: (item) => { return `ITEM$: ${item._objectLabel}` }
   }, {
     termRegex: /\!(\w*)/,
     fetch: (term) => {
       switch(term) {
         case '!':
           return Promise.resolve([
             { _objectLabel: '3a' },
             { _objectLabel: '4a' }
           ]);
         case '!3':
           return Promise.resolve([
             { _objectLabel: '3a' }
           ]);
         case '!4':
           return Promise.resolve([
             { _objectLabel: '4a' }
           ]);
         default:
           return Promise.resolve([])
       }
     },
     selectItem: (item) => { return `ITEM!: ${item._objectLabel}` }
   }]}
/>
```

### Component Name

PlainMarkdownEditor

### License

Licensed by © 2017 OpusCapita

