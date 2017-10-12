/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { Modal, Button } from 'react-bootstrap';

import text from './example.md';

@showroomScopeDecorator
export default
class MarkdownInputModalScope extends React.Component {
  state = {
    markdownExample: text,
    show: true
  };

  handleShowModal = () => {
    this.setState({ show: true });
  };

  handleHideModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div>
        <Button bsStyle='primary' onClick={this.handleShowModal}>
          Show
        </Button>
        <Modal show={this.state.show}
          onHide={this.handleHideModal}
        >
          <Modal.Header closeButton={true}>
            Modal Test
          </Modal.Header>
          <Modal.Body>
            {this._renderChildren()}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
