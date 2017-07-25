import React from 'react';
import Types from 'prop-types';
import {
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
  MarkdownPlugin,
  MarkdownStrikethroughButton,
  MarkdownUnorderedListButton
} from '../SlateEditor/plugins';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';

import { Plain } from 'slate';

class PlainMarkdownEditor extends React.Component {
  state = {
    editorState: Plain.deserialize(this.props.value || ''),
    fullScreen: false
  };

  componentWillMount = () => {
    this.plugins = [
      MarkdownPlugin()
    ];
  };

  handleChange = (editorState) => {
    this.props.onChange(Plain.serialize(editorState));

    this.setState({ editorState });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

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
            <MarkdownBoldButton/>
            <MarkdownItalicButton/>
            <MarkdownStrikethroughButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
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

          <SlateToolbarGroup>
            <FullScreenButton onFullScreen={onFullScreen} fullScreen={fullScreen}/>
          </SlateToolbarGroup>

          {children}
        </SlateToolbar>
        <SlateContent isPlainMode={true} />
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
