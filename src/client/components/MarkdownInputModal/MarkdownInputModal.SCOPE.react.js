/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React from 'react';
import Types from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { Modal, Button } from 'react-bootstrap';
import classNames from 'classnames';
import './MarkdownInputModal.less';

import text from './example.md';

@showroomScopeDecorator
export default
class MarkdownInputModalScope extends React.Component {
  state = {
    markdownExample: text,
    show: true,
    fullScreen: false
  };

  handleShowModal = () => {
    this.setState({ show: true });
  };

  handleHideModal = () => {
    this.setState({ show: false });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  render() {
    const modalClasses = classNames({
      fullscreen: this.state.fullScreen,
      ...this.props.className
    });

    return (
      <div>
        <Button bsStyle='primary' onClick={this.handleShowModal}>
          Show
        </Button>
        <Modal
          className={modalClasses}
          show={this.state.show}
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

MarkdownInputModalScope.propTypes = {
  className: Types.object
};

MarkdownInputModalScope.defaultProps = {
  className: {}
};
