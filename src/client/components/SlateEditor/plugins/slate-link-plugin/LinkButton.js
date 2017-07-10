import React from 'react';
import Types from 'prop-types';
import { getLink, getSelectedText, updateLink } from './LinkUtils';

import LinkEditor from './LinkEditor';
import classnames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const propTypes = {
  state: Types.object,
  autoCompletionLinks: Types.array,
  onChange: Types.func
};

const defaultProps = {
  onChange: () => {}
};

class LinkButton extends React.Component {
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
    const { state, autoCompletionLinks } = this.props;


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
              autoCompletionLinks={autoCompletionLinks}
            />
          ) : null }
          <i className="fa fa-link"/>
        </button>
      </OverlayTrigger>
    );
  }
}

LinkButton.propTypes = propTypes;
LinkButton.defaultProps = defaultProps;

export default LinkButton;
