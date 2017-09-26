import React from 'react';
import Types from 'prop-types';
import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin/FullScreenButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import schema from './slate/schema';
import shortcuts from './slate/shortcuts';
import { hasMultiLineSelection } from './slate/transforms';
import './PlainMarkdownInput.less';
import { State } from 'slate';
import { parse } from './slate/tokenizer';

import {
  AutocompletePlugin,
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
import Plain from 'slate-plain-serializer';

class PlainMarkdownInput extends React.Component {
  constructor(props) {
    super(props);

    let editorState = Plain.deserialize(props.value || '');
    let stateJSON = editorState.toJSON();
    let nodesSize = stateJSON.document.nodes.length;
    for (let i = 0; i < nodesSize; i++) {
      let node = stateJSON.document.nodes[i];
      let text = node.nodes[0].ranges[0].text;
      node.data = {
        text,
        tokensParse: parse(text),
      };
    }
    editorState = State.fromJSON(stateJSON);

    this.state = {
      editorState,
      fullScreen: false
    };
  }

  componentWillMount() {
    this.initialBodyOverflowStyle = document.body.style.overflow;
  }

  handleChange = (obj) => {
    // XXX Slate "Editor.props.onChange" behavior changed
    // https://github.com/ianstormtaylor/slate/blob/master/packages/slate/Changelog.md#0220--september-5-2017
    let editorState = obj.state || obj;

    let numBlock = false;
    let key = editorState.blocks.get(0).key;
    let nodesSize = editorState.document.nodes.size;
    for (let i = 0; i < nodesSize; i++) {
      if (key === editorState.document.nodes.get(i).key) {
        numBlock = i;
        break;
      }
    }

    if (numBlock) {
      let text = editorState.texts.get(0).text;
      let editorStateMutable = editorState.asMutable();

      const currNode = editorState.document.nodes.get(numBlock).asMutable();
      currNode.data = {
        text,
        tokensParse: parse(text),
      };
      let nodes = editorState.document.nodes.asMutable();
      nodes.set(numBlock, currNode.asImmutable());
      editorStateMutable.document = editorStateMutable.document.asMutable();
      editorStateMutable.document.nodes = nodes.asImmutable();
      editorStateMutable.document = editorStateMutable.document.asImmutable();
      editorState = editorStateMutable.asImmutable();
    }
    this.props.onChange(Plain.serialize(editorState));

    this.setState({ editorState });
  };

  handleFullScreen = () => {
    let fullScreen = !this.state.fullScreen;

    document.body.style.overflow = fullScreen ? 'hidden' : this.initialBodyOverflowStyle;

    this.setState({ fullScreen });
    this.props.onFullScreen(fullScreen);
  };

  onKeyDown(event, data, state) {
    return shortcuts(event, data, state);
  }

  render() {
    const { editorState } = this.state;
    const { children, extensions } = this.props;

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
        onChange={this.handleChange}
        plugins={[
          AutocompletePlugin({ extensions: extensions, onChange: this.handleChange })
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
