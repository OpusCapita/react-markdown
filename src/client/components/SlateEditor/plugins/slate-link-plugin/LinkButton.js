import React from 'react';
import PropTypes from 'prop-types';
import { getLink, getSelectedText, updateLink } from './LinkUtils';

import LinkEditor from './LinkEditor';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

class LinkButton extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    onChange: TypPropTypeses.func
  };

  static defaultProps = {
    onChange: () => {}
  };


  state = {
    openEditor: false
  };

  handleInsert = ({ text, href }) => {
    this.setState({ openEditor: false });

    const { state, onChange } = this.props;
    onChange(
      updateLink(state, { text, href })
    )
  };

  handleCancel = () => {
    this.setState({ openEditor: false });

    const { state, onChange } = this.props;
    onChange(state.transform().focus().apply());
  };

  render() {
    const { openEditor } = this.state;
    const { state } = this.props;


    const link = getLink(state);
    let text = getSelectedText(state) || '';

    if (!text && link) {
      text = link.text;
    }

    const editMode = link ? 'update' : 'insert';

    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="bold-tp">Insert Link</Tooltip>}>
        <button className={classnames({ 'btn btn-default': true, active: editMode === 'update' })}
          onClick={e => this.setState({ openEditor: true })}
        >

          {openEditor ? (
            <LinkEditor mode={editMode}
              text={text}
              href={link ? link.data.get('href') : ''}
              onChange={this.handleInsert}
              onCancel={this.handleCancel}
            />
          ) : null }
          <i className="fa fa-link"/>
        </button>
      </OverlayTrigger>
    );
  }
}

export default LinkButton;
