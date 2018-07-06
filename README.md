# React Markdown

[![CircleCI Status](https://circleci.com/gh/OpusCapita/react-markdown/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/OpusCapita/react-markdown)
![badge-npm-version](https://img.shields.io/npm/v/@opuscapita/react-markdown.svg) 
![badge-license](https://img.shields.io/github/license/OpusCapita/react-markdown.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/react-markdown.svg)

![demo](https://raw.githubusercontent.com/OpusCapita/react-markdown/master/demo.gif)

Built using [slate-js](https://github.com/ianstormtaylor/slate)

## Usage

Install npm package:

`npm install -E @opuscapita/react-markdown`

Import it to your application

`import MarkdownInput from '@opuscapita/react-markdown`

See interactive example for more details: https://opuscapita.github.io/react-markdown

> Demo powered by [React Showroom](https://github.com/OpusCapita/react-showroom-client)

If you want to use together with Bootstrap Modal, you need to add styles:

```
.markdown-input_fullscreen { // pass this class to Modal component
  overflow: hidden;
}
.markdown-input_fullscreen.modal.in .modal-dialog {
  transform: none;
}
```

## How it works

MarkdownEditor supports the following decorators: 

- `bold` 
- `italic` 
- `strikethrough` 
- `heading-1` 
- `heading-2` 
- `heading-3`
- `heading-4` 
- `heading-5` 
- `heading-6`
- `list` 
- `ordered-list`

### Buttons (their groups, sequence)

\[B, I, S\] \[A\] \[H1, H2, H3, H4, H5, H6\], \[UL, OL\]
- inline text actions
  - \[B\] - bold mark
  - \[I\] - italic mark
  - \[S\] - strikethrough mark
- link
  - \[A\] - anchor insert
- text block actions 
  - \[H1\] - header 1 block
  - \[H2\] - header 2 block
  - \[H3\] - header 3 block
  - \[H4\] - header 4 block
  - \[H5\] - header 5 block
  - \[H6\] - header 6 block
- lists
  - \[UL\] - list block
  - \[OL\] - ordered list block
  
**Note for multi-line selection**: only `list` and `ordered list` are available for multi-line selection, other buttons in a toolbar are disabled, because otherwise markdown highlighting becomes inconsistent.

### Behaviour

#### Block elements

##### List [UL] button
Here is specification by video example for this button

![list-button-optimized](https://user-images.githubusercontent.com/24603787/28166906-5d5a7ad6-67e2-11e7-9dd6-5f054a7c3431.gif)

- Insert marker '* ' at the beginning of the line if line does not start with ['{number}. ', '# ', '## ', '### ', '#### ', '##### ', '###### ']
- Replace with marker '* ' if line starts with  ['{number}. ', '# ', '## ', '### ', '#### ', '##### ', '###### ']
- Insert marker '* ' at the beginning of the next line if `enter` is pressed at the end of the line that is marked as list item if item contain any text
- Clear line from '* ' and put cursor to a new line if user pressed `enter` at the end of the line that marked as list item but does not contain any text

##### Ordered list [OL] button
Here is specification by video example for this button

![ordered-list-button-optimized](https://user-images.githubusercontent.com/24603787/28167332-ecdaa7e8-67e3-11e7-9da3-b41de506deed.gif)

  - Insert marker '1. ' at start of the line if it does not start with ['* ', '# ', '## ', '### ', '#### ', '##### ', '###### ']
  - Replace with marker '1. ' if line starts with  ['* ', '# ', '## ', '### ', '#### ', '##### ', '###### ']
  - Insert marker '{number+1} ' at the beginning of in the next line if `enter` is pressed at the end of the line that is marked as list item if item contains any text
  - Clear line from '{number} ' and put cursor to a new line if user pressed `enter` at the end of the line that is marked as ordered list item but does not contain any text
  
##### Header item [h1-h6] buttons
Here is specification by video example for \[H2\] button (other header buttons work correspondingly)

![h2-button-optimized](https://user-images.githubusercontent.com/24603787/28199634-d3d3cbbc-686f-11e7-9fd6-3da0e41fe3b9.gif)

  - Insert marker '# ' - '###### ' (in depends on button) at start of the line if it does not start with ['* ', '{number}. ']
  - Replace with marker '# ' - '###### ' (in depends on button) if line stars with ['* ', '{number}. ']
  - Remove existing header marker if corresponding header button is clicked
  - Update existing header marker to another header marker one if current header marker does not correspond to pressed header button

#### Marked elements
Here is specification by video example for these buttons

![bold-italic-strikethrough-optimized](https://user-images.githubusercontent.com/24603787/28200156-0128f076-6873-11e7-95cc-46944c548800.gif)

##### Bold [B] button
  - Selected text is wrapped with '\*\*', e.g.  {selected\_text} -> \*\*{selected_text}\*\*
  - If selected text contains bold text then it is unwrapped, for example  \*\*{selected\_text}\*\* -> {selected\_text}
  - Inserts '\*\*{cursor}\*\*' into cursor position if text is not selected, and cursor is placed inside
##### Italic [I] button
  - Selected text is wrapped with '\_', e.g.  {selected\_text} -> \_{selected_text}\_
  - If selected text is marked as italic then it is unwrapped, for example  \_{selected\_text}\_ -> {selected\_text}
  - Inserts '\_{cursor}\_' into cursor position if text is not selected, and cursor is placed inside
##### Strikethrough [S]  button
  - Selected text is wrapped with '\~\~', e.g.  {selected\_text} -> \~\~{selected_text}\~\~
  - If selected text is marked as strikethrough then it is unwrapped, for example  \~\~{selected\_text}\~\~ -> {selected\_text}
  - Inserts '\~\~{cursor}\~~' into cursor position if text is not selected, and cursor is placed inside

#### Inline elements
##### External anchor [A] button
Here is specification by video example for this button

![link-button-optimized](https://user-images.githubusercontent.com/24603787/28200219-5d42085c-6873-11e7-9071-3140c8c2ad53.gif)

  - Wraps selected text with '\[' and '\](http://example.com)', for example {selected\_text} -> \[{selected\_text}\](http://example.com)
  - Inserts text \[link text\](http://example.com) into cursor position if text is not selected.

## Known issues
* In case of multi line selection toolbar all buttons except `list` and `ordered list` are not available (no action is supported)
* Code blocks are not supported

## Contributors

| [<img src="https://avatars.githubusercontent.com/u/24603787?v=3" width="100px;"/>](https://github.com/asergeev-sc) | [**Alexey Sergeev**](https://github.com/asergeev-sc)     |
| :---: | :---: |
 [<img src="https://avatars.githubusercontent.com/u/24733803?v=3" width="100px;"/>](https://github.com/ddivin-sc) | [**Dmitry Divin**](https://github.com/ddivin-sc) |
 [<img src="https://avatars.githubusercontent.com/u/25082620?v=3" width="100px;"/>](https://github.com/dsanko-sc) | [**Dmitry Sanko**](https://github.com/dsanko-sc) |
  [<img src="https://avatars.githubusercontent.com/u/28590602?v=3" width="100px;"/>](https://github.com/abaliunov-sc) | [**Aleksandr Baliunov**](https://github.com/abaliunov-sc) |
| [<img src="https://avatars.githubusercontent.com/u/24652543?v=3" width="100px;"/>](https://github.com/kvolkovich-sc) | [**Kirill Volkovich**](https://github.com/kvolkovich-sc) |

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for the full license text.
