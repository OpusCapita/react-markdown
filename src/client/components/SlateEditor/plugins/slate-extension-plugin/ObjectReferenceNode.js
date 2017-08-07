import React from 'react';
import PropTypes from 'prop-types';
import { State, Document } from 'slate';
import ObjectReferenceEditor from './ObjectReferenceEditor';
import { removeObjectReference, updateObjectReferenceText } from './ObjectReferenceUtils';

export default function(options) {
  class ObjectReferenceNode extends React.Component {
    static propTypes = {
      extension: PropTypes.object,
      onRemoveObjectReference: PropTypes.func,
      onChange: PropTypes.func,
      node: PropTypes.object,
      editor: PropTypes.object
    };

    static defaultProps = {
      extension: null,
      onRemoveObjectReference: () => {},
      onChange: () => {}
    };

    constructor(props) {
      super(props);
      this.state = {
        isCloseButtonHover: false,
        node: props.node,
        show: false
      };
    }

    componentWillReceiveProps = (nextProps) => {
      let { editor, node } = this.props;
      if (node.text !== nextProps.node.text) {
        const state = editor.getState();
        editor.onChange(
          removeObjectReference(nextProps.node, state)
        );
      }
    };

    // handle deleting objectReference with 'Delete' keyboard button
    componentWillUnmount = () => {
      let { editor } = this.props;
      const state = editor.getState();

      let blocks = state.document.nodes;
      let blockIndex = blocks.findIndex((block) => {
        return block.key === state.startBlock.key;
      });
      let blockNodes = state.document.nodes.get(blockIndex).nodes;
      let nodeIndex = blockNodes.findIndex((node) => {  // check if objectReference first character was deleted
        return node.text === this.props.node.text.substr(1);
      });
      if (nodeIndex !== -1) {
        blockNodes = blockNodes.delete(nodeIndex); // deleting 'objectReference' inline node

        let newBlock = blocks.get(blockIndex).set('nodes', blockNodes);
        let newDocumentBlocks = blocks.set(blockIndex, newBlock);
        let document = Document.create(Object.assign({}, state.document, { nodes: newDocumentBlocks }));

        editor.onChange(
          State.create({ document, selection: state.selection })
        );
      }
    };

    handleRemoveObjectReference = () => {
      let { editor, node } = this.props;
      const state = editor.getState();
      editor.onChange(
        removeObjectReference(node, state)
      );
    };

    handleChange = (text) => {
      let { editor, node } = this.props;
      const { data } = node;
      const extension = data.get('extension');
      const state = editor.getState();
      editor.onChange(
        updateObjectReferenceText(text, extension, node, state)
      );
      this.setState({ show: false });
    };

    render() {
      const { node, children } = this.props;
      const { data } = node;
      const extension = data.get('extension');
      const { isCloseButtonHover, show } = this.state;

      let inlineBlockStyle = {
        backgroundColor: extension.color,
        border: 0,
        borderRadius: '3px',
        padding: '2px',
        cursor: 'pointer',
        outline: 0,
        overflow: 'hidden'
      };
      let closeButtonStyle = {
        padding: '3px',
        border: 0,
        color: isCloseButtonHover ? 'black' : 'grey',
        background: 'transparent',
        fontSize: '16px',
        fontWeight: 700
      };
      return (
        <span style={inlineBlockStyle} contentEditable="false" onClick={() => { this.setState({ show: true }) }}>
          {children}
          <button type="button"
            style={closeButtonStyle}
            onClick={this.handleRemoveObjectReference}
            onMouseOver={() => { this.setState({ isCloseButtonHover: true }) }}
            onMouseOut={() => { this.setState({ isCloseButtonHover: false }) }}
          >
            <span>&times;</span>
          </button>
          &nbsp;
          {show ? (
            <ObjectReferenceEditor extension={extension}
              onChange={this.handleChange}
              onCancel={() => { this.setState({ show: false }) }}
              text={node.text}
            />
          ) : null }
        </span>
      )
    }
  }
  return ObjectReferenceNode;
}
