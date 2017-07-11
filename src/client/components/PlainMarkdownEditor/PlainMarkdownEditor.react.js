import React from 'react';
import Types from 'prop-types';
import {
  AutocompletePlugin,
  FullScreenButton,
  MarkdownBoldButton,
  MarkdownHeaderFiveButton,
  MarkdownHeaderFourButton,
  MarkdownHeaderOneButton,
  MarkdownHeaderSixButton,
  MarkdownHeaderThreeButton,
  MarkdownHeaderTwoButton,
  MarkdownItalicButton,
  MarkdownLinkButton,
  MarkdownOrderedListButton,
  MarkdownPreviewPlugin,
  MarkdownStrikethroughButton,
  MarkdownUnorderedListButton
} from '../SlateEditor/plugins';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';

import { Plain } from 'slate';

class PlainMarkdownEditor extends React.Component {
  state = {
    editorState: Plain.deserialize(this.props.value || '')
  };

  componentWillMount = () => {
    const { autocompletes = [] } = this.props;
    this.plugins = [
      AutocompletePlugin(
        {
          rules: autocompletes
        }
      ),
      MarkdownPreviewPlugin()
    ];
  };

  handleChange = (editorState) => {
    this.props.onChange(Plain.serialize(editorState));

    this.setState({ editorState });
  };

  render() {
    const { editorState } = this.state;
    const { children, onFullScreen, fullScreen } = this.props;

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        plugins={this.plugins}
        onChange={this.handleChange}
      >

        <SlateToolbar>
          <SlateToolbarGroup>
            <MarkdownBoldButton/>
            <MarkdownItalicButton/>
            <MarkdownStrikethroughButton/>
            <MarkdownLinkButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <MarkdownHeaderOneButton/>
            <MarkdownHeaderTwoButton/>
            <MarkdownHeaderThreeButton/>
            <MarkdownHeaderFourButton/>
            <MarkdownHeaderFiveButton/>
            <MarkdownHeaderSixButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <MarkdownOrderedListButton/>
            <MarkdownUnorderedListButton/>
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
    );
  }
}

PlainMarkdownEditor.propTypes = {
  autocompletes: Types.array,
  value: Types.string,
  onChange: Types.func,
  onFullScreen: Types.func,
  fullScreen: Types.bool,
};

export default PlainMarkdownEditor;
