import React from 'react';
import Types from 'prop-types';
import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin/FullScreenButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import schema from './slate/schema';
import shortcuts from './slate/shortcuts';
import { hasMultiLineSelection } from './slate/transforms';
import './PlainMarkdownInput.less';

import {
  AutocompletePlugin, // eslint-disable-line
  ObjectReferenceButton
} from '../SlateEditor/plugins';

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
import { Raw } from '@opuscapita/slate';

function deserialize(string, options = {}) {
  let raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: [{
        kind: 'block',
        type: 'multiline',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: string,
                marks: [],
              }
            ]
          }
        ]
      }]
    }
  };
  return Raw.deserialize(raw);
}

class PlainMarkdownInput extends React.Component {
  state = {
    editorState: deserialize(this.props.value || ''),
    fullScreen: false
  };

  componentWillMount() {
    this.initialBodyOverflowStyle = document.body.style.overflow;
  }

  handleChange = (editorState) => {
    this.setState({ editorState });
  };

  handleFullScreen = () => {
    let fullScreen = !this.state.fullScreen;

    document.body.style.overflow = fullScreen ? 'hidden' : this.initialBodyOverflowStyle;

    this.setState({ fullScreen });
    this.props.onFullScreen(fullScreen);
  };

  handleKeyDown(event, data, state) {
    return shortcuts(event, data, state);
  }

  render() {
    const { editorState } = this.state;
    const { children, extensions } = this.props; // eslint-disable-line

    const fullScreen = this.props.fullScreen;

    let objectReferenceButtons = this.props.extensions.map((extension, index) => {
      return (
        <ObjectReferenceButton
          key={index}
          extension={extension}
          disabled={false}
        />
      );
    });

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        schema={schema}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        plugins={[
          // AutocompletePlugin({ extensions: extensions, onChange: this.handleChange })
        ]}
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
            <div title="Insert header">
              <DropdownButton
                id="oc-md--toolbar__headers-dropdown"
                title={<i className="fa fa-header"/>}
                disabled={hasMultiLineSelection(editorState)}
              >
                <HeaderOneButton state={editorState} onChange={this.handleChange}/>
                <HeaderTwoButton state={editorState} onChange={this.handleChange}/>
                <HeaderThreeButton state={editorState} onChange={this.handleChange}/>
                <HeaderFourButton state={editorState} onChange={this.handleChange}/>
                <HeaderFiveButton state={editorState} onChange={this.handleChange}/>
                <HeaderSixButton state={editorState} onChange={this.handleChange}/>
              </DropdownButton>
            </div>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <OrderedListButton/>
            <UnorderedListButton/>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            {objectReferenceButtons}
          </SlateToolbarGroup>

          <SlateToolbarGroup className="react-markdown--plain-markdown-input__fullscreen-button">
            <FullScreenButton onClick={this.handleFullScreen} fullScreen={fullScreen} />
          </SlateToolbarGroup>

          {children}
        </SlateToolbar>
        <SlateContent />
      </SlateEditor>
    );
  }
}

PlainMarkdownInput.propTypes = {
  extensions: Types.array,
  value: Types.string,
  onChange: Types.func,
  onFullScreen: Types.func,
  fullScreen: Types.bool
};

PlainMarkdownInput.defaultProps = {
  extensions: [],
  value: '',
  fullScreen: false,
  onFullScreen: () => {},
  onChange: () => {}
};

export default PlainMarkdownInput;
