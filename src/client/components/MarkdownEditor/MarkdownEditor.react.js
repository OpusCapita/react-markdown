import React from 'react';
import RichMarkdownEditor from '../RichMarkdownEditor';
import PlainMarkdownEditor from '../PlainMarkdownEditor';
import SlateToolbarGroup from '../SlateEditor/SlateToolbarGroup';
import SwitchModeButton from './SwitchModeButton.react';

/**
 * https://markdown-it.github.io/
 */
export default class MarkdownEditor extends React.Component {
  state = {
    mode: this.props.mode || 'rich',
    value: this.props.value || '',
    fullScreen: false
  };

  handleChangeMode = (mode) => {
    this.setState({mode});
  };

  handleChangeValue = (value) => {
    this.props.onChange && this.props.onChange(value);

    this.setState({value});
  };

  handleFullScreen = () => {
    const {fullScreen} = this.state;
    this.setState({fullScreen: !fullScreen});
  };

  render() {
    const {mode, value, fullScreen} = this.state;
    const {autocompletes, autoCompletionLinks} = this.props;
    if (mode === 'plain') {
      return (
        <PlainMarkdownEditor value={value}
                             onChange={this.handleChangeValue}
                             autocompletes={autocompletes}
                             onFullScreen={this.handleFullScreen}
                             fullScreen={fullScreen}>
          <SlateToolbarGroup>
            <SwitchModeButton onChangeMode={this.handleChangeMode} mode="plain"/>
          </SlateToolbarGroup>
        </PlainMarkdownEditor>
      );
    } else if (mode === 'rich') {
      return (
        <RichMarkdownEditor value={value}
                            onChange={this.handleChangeValue}
                            autocompletes={autocompletes}
                            autoCompletionLinks={autoCompletionLinks}
                            onFullScreen={this.handleFullScreen}
                            fullScreen={fullScreen}>
          <SlateToolbarGroup>
            <SwitchModeButton onChangeMode={this.handleChangeMode} mode="rich"/>
          </SlateToolbarGroup>
        </RichMarkdownEditor>
      )
    } else {
      throw new Error(`Mode '${mode}' not supported`);
    }
  };
}
