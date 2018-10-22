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
    showConfirm: false,
    fullScreen: false
  };

  handleShowModal = () => {
    this.setState({ show: true });
  };

  handleHideModal = () => {
    this.setState({ showConfirm: true });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  handleModalAnimationEnd = () => {
    window.markdownInputModalRef.focus();
  }

  render() {
    const { showConfirm } = this.state;

    const modalClasses = classNames({
      'markdown-input_fullscreen': this.state.fullScreen,
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
          animation={true}
          onEntered={this.handleModalAnimationEnd}
        >
          <Modal.Header closeButton={true}>
            Modal Test
          </Modal.Header>
          <Modal.Body>
            <Modal
              show={showConfirm}
              style={{ top: '30%' }}
            >
              <Modal.Header>Confirmation</Modal.Header>
              <Modal.Body>You what?</Modal.Body>
              <Modal.Footer>
                <button
                  className='btn btn-primary'
                  onClick={_ => this.setState({ show: false, showConfirm: false })}
                >Confirm</button>
                <button
                  className='btn btn-default'
                  onClick={_ => this.setState({ showConfirm: false })}
                >Cancel</button>
              </Modal.Footer>
            </Modal>
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
