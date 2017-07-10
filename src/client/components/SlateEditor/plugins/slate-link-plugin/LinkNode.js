import React from 'react';

import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

import { unlink, updateLink } from './LinkUtils';

import LinkEditor from './LinkEditor';

import './LinkNode.css';

export default function(options) {
  class LinkNode extends React.Component {
    state = {
      editMode: false
    };

    handleUnlink = (e) => {
      e.preventDefault();

      const { editor } = this.props;
      const state = editor.getState();
      editor.onChange(unlink(state));
    };

    handleEdit = (e) => {
      e.preventDefault();

      this.refs.overlay.hide();

      this.setState({ editMode: true });
    };

    handleOpen = () => {
      this.refs.overlay.hide();
    };

    handleCancel = () => {
      this.setState({ editMode: false });
    };

    handleChange = ({ text, href }) => {
      this.setState({ editMode: false });
      const { editor } = this.props;
      const state = editor.getState();

      editor.onChange(
        updateLink(state, { href, text })
      );
    };

    render() {
      const { editMode } = this.state;
      const { node, children, attributes } = this.props;
      const { data } = node;
      const href = data.get('href');
      const { text } = node;

      const popover = (
        <Popover id="edit-anchor">
          <div className="btn-group">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="open-link-tp">Open Link</Tooltip>}>
              <a className="btn btn-default" href={href} onClick={this.handleOpen} target="_blank">
                <i className="fa fa-external-link"/>
              </a>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="edit-link-tp">Edit Link</Tooltip>}>
              <a className="btn btn-default" href="javascript:void(0)" onClick={this.handleEdit}>
                <i className="fa fa-pencil-square-o"/>
              </a>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="unlink-tp">Unlink</Tooltip>}>
              <a className="btn btn-default" href="javascript:void(0)" onClick={this.handleUnlink}>
                <i className="fa fa-chain-broken"/>
              </a>
            </OverlayTrigger>
          </div>
        </Popover>
      );

      return (
        <span>
          {editMode ? (
            <LinkEditor mode="update"
              href={href}
              text={text}
              onChange={this.handleChange}
              onCancel={this.handleCancel}
              autoCompletionLinks={options.links}
            />
          ) : null}

          <OverlayTrigger ref="overlay" trigger="click" rootClose={true} placement="bottom" overlay={popover}>
          <a {...attributes} href={href}>{children}</a>
        </OverlayTrigger>
      </span>
      );
    }
  }

  return LinkNode;
}
