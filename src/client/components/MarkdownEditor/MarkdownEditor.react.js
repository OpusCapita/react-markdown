import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RichMarkdownEditor from '../RichMarkdownEditor';
import PlainMarkdownEditor from '../PlainMarkdownEditor';
import SlateToolbarGroup from '../SlateEditor/SlateToolbarGroup';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

class MarkdownEditor extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    extensions: PropTypes.array
  };

  static defaultProps = {
    mode: 'plain',
    value: '',
    onChange: () => {},
    extensions: []
  };

  state = {
    mode: this.props.mode,
    value: this.props.value,
    fullScreen: false
  };

  handleSwitchMode = () => {
    const { mode } = this.state;
    if (mode === 'rich') {
      this.setState({ mode: 'plain' });
    } else {
      this.setState({ mode: 'rich' });
    }
  };

  handleChangeValue = (value) => {
    this.props.onChange(value);

    this.setState({ value });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  renderSwitchModeButton = () => {
    const { mode } = this.state;
    return (
      <SlateToolbarGroup>
        <OverlayTrigger placement="bottom"
          overlay={<Tooltip id="switch-tp">{mode === 'rich' ? 'Plain Mode' : 'Rich Mode'}</Tooltip>}
        >
          <button className={classnames('btn btn-default', { active: mode === 'plain' })}
            onClick={this.handleSwitchMode}
          >
            <i className="fa fa-code"/>
          </button>
        </OverlayTrigger>
      </SlateToolbarGroup>
    );
  }

  render() {
    const { mode, value, fullScreen } = this.state;
    const { extensions } = this.props;

    if (mode === 'plain') {
      return (
        <PlainMarkdownEditor
          value={value}
          onChange={this.handleChangeValue}
          onFullScreen={this.handleFullScreen}
          fullScreen={fullScreen}
          extensions={extensions}
        >
          {/* Temporary disabled switch to "rich editor mode"
              this.renderSwitchModeButton()
          */}
        </PlainMarkdownEditor>
      );
    } else {
      // mode is 'rich'
      return (
        <RichMarkdownEditor
          value={value}
          onChange={this.handleChangeValue}
          onFullScreen={this.handleFullScreen}
          fullScreen={fullScreen}
          extensions={extensions}
        >
          {/* Temporary disabled switch to "rich editor mode"
              this.renderSwitchModeButton()
          */}
        </RichMarkdownEditor>
      );
    }
  }
}

export default MarkdownEditor;
