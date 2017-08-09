[![CircleCI Status](https://circleci.com/gh/OpusCapita/react-markdown/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/OpusCapita/react-markdown-editor)
![badge-npm-version](https://img.shields.io/npm/v/@opuscapita/react-markdown-editor.svg) 
![badge-license](https://img.shields.io/github/license/OpusCapita/react-markdown-editor.svg)

# React Markdown Editor

Markdwon editor based on [slate-js](https://github.com/ianstormtaylor/slate)

![demo](https://github.com/OpusCapita/react-markdown-editor/demo.gif)

## Usage

`npm install -E @opuscapita/react-markdown-editor`

`import { MarkdownEditor } from '@opuscapita/react-markdown-editor'`

See interactive documentation for component API details: https://opuscapita.github.io/react-markdown-editor

> Demo powered by [React Showroom](https://github.com/OpusCapita/react-showroom-client)

## Internet Explorer 11 support

[slate-js](https://github.com/ianstormtaylor/slate) uses ES6 `Symbol` data type.

It isn't supported in IE11.

Add a `babel-polyfill` to your html file:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js"></script>`

## Known issues

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
