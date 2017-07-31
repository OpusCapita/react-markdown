import React from 'react';
import Types from 'prop-types';
import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin/FullScreenButton';
import schema from './slate/schema';
import shortcuts from './slate/shortcuts';

import {
  BoldButton,
  HeaderFiveButton,
  HeaderFourButton,
  HeaderOneButton,
  HeaderSixButton,
  HeaderThreeButton,
  HeaderTwoButton,
  ItalicButton,
  LinkButton,
  OrderedListButton,
  StrikethroughButton,
  UnorderedListButton
} from './buttons';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';

import { Plain } from 'slate';

class PlainMarkdownEditor extends React.Component {
  state = {
    editorState: Plain.deserialize(this.props.value || ''),
    fullScreen: false
  };

  handleChange = (editorState) => {
    this.props.onChange(Plain.serialize(editorState));

    this.setState({ editorState });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  onKeyDown(event, data, state) {
    return shortcuts(event, data, state);
  }

  render() {
    const { editorState } = this.state;
    const { children } = this.props;

    const onFullScreen = this.props.onFullScreen || this.handleFullScreen;
    const fullScreen = this.props.onFullScreen ? this.props.fullScreen : this.state.fullScreen;

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        schema={schema}
        onChange={this.handleChange}
      >
        <SlateToolbar>
          <SlateToolbarGroup>
            <BoldButton/>
            <ItalicButton/>
            <StrikethroughButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
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
  fullScreen: Types.bool
};

export default PlainMarkdownEditor;
