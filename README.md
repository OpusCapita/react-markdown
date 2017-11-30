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
