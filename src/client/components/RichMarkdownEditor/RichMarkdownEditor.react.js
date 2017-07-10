import React from 'react';

import Markdown from '../serializer/MarkdownRenderer';

import {
  AutocompletePlugin,
  BlockquoteButton,
  BlockquotePlugin,
  BoldButton,
  BoldPlugin,
  FormatPlugin,
  FullScreenButton,
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
  UnorderedListButton
} from '../SlateEditor/plugins';
import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';

const markdown = new Markdown();

/**
 * The rich text example.
 *
 * @type {Component}
 */

export default class RichMarkdownEditor extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    editorState: markdown.deserialize(this.props.value || '')
  };

  /**
   * On change, save the new state.
   *
   * @param {State} editorState
   */

  onChange = (editorState) => {
    this.props.onChange && this.props.onChange(markdown.serialize(editorState));

    this.setState({ editorState });
  };

  componentWillMount = () => {
    const { autocompletes = [], autoCompletionLinks = [] } = this.props;
    this.plugins = [
      LinkPlugin(
        {
          links: autoCompletionLinks
        }
      ),
      ListPlugin(),
      StrikethroughPlugin(),
      BoldPlugin(),
      ItalicPlugin(),
      BlockquotePlugin(),
      HeaderPlugin(),
      FormatPlugin(),
      AutocompletePlugin(
        {
          rules: autocompletes
        }
      )
    ];
  };

  /**
   * Render.
   *
   * @return {Element}
   */
  render() {
    const { editorState } = this.state;
    const { children, autoCompletionLinks, onFullScreen, fullScreen } = this.props;

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        plugins={this.plugins}
        onChange={this.onChange}
      >

        <SlateToolbar>
          <SlateToolbarGroup>
            <BoldButton/>
            <ItalicButton/>
            <StrikethroughButton/>
            <LinkButton autoCompletionLinks={autoCompletionLinks}/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <BlockquoteButton/>
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

          {onFullScreen ? (
            <SlateToolbarGroup>
              <FullScreenButton onClick={onFullScreen} fullScreen={fullScreen}/>
            </SlateToolbarGroup>
          ) : null}

          {children}
        </SlateToolbar>
        <SlateContent/>
      </SlateEditor>
    )
  }
}
