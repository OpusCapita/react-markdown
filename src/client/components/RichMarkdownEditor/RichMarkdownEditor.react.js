import React from 'react';
import Types from 'prop-types';
import Markdown from '../serializer/MarkdownRenderer';

import {
  // AutocompletePlugin,
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
  OrderedListButton,
  StrikethroughButton,
  StrikethroughPlugin,
  UnorderedListButton,
  UnderlinePlugin
} from '../SlateEditor/plugins';

import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';

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
    editorState: markdown.deserialize(this.props.value || ''),
    fullScreen: false
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
      FormatPlugin()
      // ,
      // AutocompletePlugin()
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

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  /**
   * Render.
   *
   * @return {Element}
   */
  render() {
    const { editorState } = this.state;
    const { children } = this.props;

    const onFullScreen = this.props.onFullScreen || this.handleFullScreen;
    const fullScreen = this.props.onFullScreen ? this.props.fullScreen : this.state.fullScreen;

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
};


export default RichMarkdownEditor;
