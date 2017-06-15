### Synopsis

PlainMarkdownEditor

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| onChange                       | func                    | Callback: `(value) => {}`                                   |
| autocomplete                   | object                  | Autocomplete values for special characters                  |

### Code Example

```
<PlainMarkdownEditor 
  onChange={_scope.handleValueChange}
  autocomplete={{'@': ['1|ColumnA|ColumnB|\n|cell1|cell2|', '2|ColumnA|ColumnB|\n|cell1|cell2|\n|Cell3|Cell4|', '23|ColumnC|ColumnD|\n|cell5|cell6|\n|Cell7|Cell8|'], '!': ['3|ColumnA|ColumnB|ColumnC|\n|cell1|cell2|cell3|', '4|ColumnA|ColumnB|ColumnC|\n|cell1|cell2|cell3|\n|cell4|cell5|cell6|']}}
/>
```

### Component Name

PlainMarkdownEditor

### License

Licensed by © 2017 OpusCapita

