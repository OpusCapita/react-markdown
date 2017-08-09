import React from 'react';
import Types from 'prop-types';
import Markdown from '../serializer/MarkdownRenderer';
import { Raw } from 'slate';
import './RichMarkdownEditor.less';

import {
  AutocompletePlugin,
  BlockquotePlugin,
  BoldButton,
  BoldPlugin,
  FormatPlugin,
  HeaderFiveButton,
  HeaderFourButton,
  HeaderOneButton,
  HeaderPlugin,
  HeaderSixButton,
  HeaderThreeButton,
  HeaderTwoButton,
  ItalicButton,
  ItalicPlugin,
  LinkButton,
  LinkPlugin,
  ListPlugin,
  ObjectReferenceButton,
  ObjectReferencePlugin,
  OrderedListButton,
  StrikethroughButton,
  StrikethroughPlugin,
  UnorderedListButton,
  UnderlinePlugin
} from '../SlateEditor/plugins';

import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';
import initialState from './state.json'


const markdown = new Markdown();

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichMarkdownEditor extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */
  state = {
    editorState: Raw.deserialize(initialState, { terse: true })
  };

  componentWillMount = () => {
    this.plugins = [
      LinkPlugin(),
      ListPlugin(),
      StrikethroughPlugin(),
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      BlockquotePlugin(),
      HeaderPlugin(),
      FormatPlugin(),
      ObjectReferencePlugin({ extensions: this.props.extensions }),
      AutocompletePlugin({
        extensions: this.props.extensions
      })
    ];
  };

  /**
   * On change, save the new state.
   *
   * @param {State} editorState
   */
  handleChange = (editorState) => {
    this.props.onChange(markdown.serialize(editorState));

    this.setState({ editorState });
  };

  /**
   * Render.
   *
   * @return {Element}
   */
  render() {
    const { editorState } = this.state;
    const { children, onFullScreen, fullScreen } = this.props;

    let objectReferenceButtons = this.props.extensions.map((extension, index) => {
      return (<ObjectReferenceButton key={index}
        extension={extension}
        mode="rich"
        disabled={false}
      />)
    });

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        plugins={this.plugins}
        onChange={this.handleChange}
      >

        <SlateToolbar>
          <SlateToolbarGroup>
            <BoldButton/>
            <ItalicButton/>
            <StrikethroughButton/>
            <LinkButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <HeaderOneButton/>
            <HeaderTwoButton/>
            <HeaderThreeButton/>
            <HeaderFourButton/>
            <HeaderFiveButton/>
            <HeaderSixButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <OrderedListButton/>
            <UnorderedListButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            {objectReferenceButtons}
          </SlateToolbarGroup>

          <SlateToolbarGroup className="react-markdown--rich-markdown-editor__fullscreen-button">
            <FullScreenButton onFullScreen={onFullScreen} fullScreen={fullScreen}/>
          </SlateToolbarGroup>

          {children}
        </SlateToolbar>

        <SlateContent/>

      </SlateEditor>
    )
  }
}

RichMarkdownEditor.propTypes = {
  value: Types.string,
  onChange: Types.func,
  onFullScreen: Types.func,
  fullScreen: Types.bool,
  extensions: Types.array
};

RichMarkdownEditor.defaultProps = {
  extensions: [],
  value: '',
  fullScreen: false,
  onFullScreen: () => {},
  onChange: () => {}
};

export default RichMarkdownEditor;
