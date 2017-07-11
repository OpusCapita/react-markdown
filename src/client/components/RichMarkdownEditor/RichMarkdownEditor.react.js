import React from 'react';
import Types from 'prop-types';
import Markdown from '../serializer/MarkdownRenderer';

import {
  AutocompletePlugin,
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

class RichMarkdownEditor extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    editorState: markdown.deserialize(this.props.value || '')
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
    const { children, autoCompletionLinks, onFullScreen, fullScreen } = this.props;

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
            <LinkButton autoCompletionLinks={autoCompletionLinks}/>
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

          {onFullScreen ? (
            <SlateToolbarGroup>
              <FullScreenButton onFullScreen={onFullScreen} fullScreen={fullScreen}/>
            </SlateToolbarGroup>
          ) : null}

          {children}
        </SlateToolbar>
        <SlateContent/>
      </SlateEditor>
    )
  }
}

RichMarkdownEditor.propTypes = {
  autocompletes: Types.array,
  autoCompletionLinks: Types.array,
  value: Types.string,
  onChange: Types.func,
  onFullScreen: Types.func,
  fullScreen: Types.bool,
};


export default RichMarkdownEditor;
