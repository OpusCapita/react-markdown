import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import ClickAwayListener from './ClickAwayListener';
import AutocompleteWidget from '../slate-autocomplete-plugin/AutocompleteWidget';

const keyCodes = { ENTER: 13, LEFT_ARROW: 37, UP_ARROW: 38, RIGHT_ARROW: 39, DOWN_ARROW: 40 };

class ObjectReferenceEditor extends React.Component {
  static propTypes = {
    extension: PropTypes.object,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    text: PropTypes.string,
    mode: PropTypes.string
  };

  static defaultProps = {
    extension: null,
    onCancel: () => {},
    onChange: () => {},
    text: '',
    mode: 'update'
  };

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      show: false,
      items: [],
      selectedIndex: 0,
      caretPosition: 0,
      isMouseIndexSelected: false
    };
  }

  handleItemSelect = (index) => {
    this.setState({ text: this.state.items[index]._objectLabel });
  };

  updateAutocomplete = () => {
    let { searchItems, specialCharacter } = this.props.extension;
    let { text } = this.state;
    let caretPosition = this.getCaretPosition();
    searchItems(`${specialCharacter}${text.substr(0, caretPosition)}`).then((items) => {
      // if (this.state.items.length !== items.length) {
        this.setState({ items, show: true });
      // }
    });
  };

  handleSelectedIndexChange = (selectedIndex) => {
    if (this.state.isMouseIndexSelected) {
      this.setState({ selectedIndex });
    } else {
      this.setState({ isMouseIndexSelected: true });
    }
  };

  getCaretPosition = () => {
    let input = this.refs['link-editor-text'];
    let caretPosition = 0;
    if (input.selectionStart) {
      caretPosition = input.selectionStart;
    } else if (document.selection) {
      let selection = document.selection.createRange();
      let selectionLength = document.selection.createRange().text.length;
      selection.moveStart('character', -input.value.length);
      caretPosition = selection.text.length - selectionLength;
    }
    return caretPosition;
  };

  handleAutocompleteListManagementKeys = (e) => {
    let { selectedIndex, items } = this.state;
    switch (e.keyCode) {
      case keyCodes.ENTER:
        this.refs['link-editor-text'].blur();
        this.setState({ text: items[selectedIndex]._objectLabel, show: false });
        break;
      case keyCodes.UP_ARROW:
        e.preventDefault();
        this.setState({ selectedIndex: Math.max(--selectedIndex, 0), isMouseIndexSelected: false });
        break;
      case keyCodes.DOWN_ARROW:
        e.preventDefault();
        this.setState({ selectedIndex: Math.min(++selectedIndex, items.length - 1), isMouseIndexSelected: false });
        break;
      default:
        break;
    }
  };

  handleKeyUp = (e) => {
    if (e.keyCode === keyCodes.LEFT_ARROW || e.keyCode === keyCodes.RIGHT_ARROW) {
      this.setState({ selectedIndex: 0 });
    }
    this.updateAutocomplete();
  };

  handleInputClick = () => {
    this.setState({ selectedIndex: 0 });
    this.updateAutocomplete();
  };

  render() {
    const { onChange, onCancel, mode } = this.props;
    const { text, items, selectedIndex, isMouseIndexSelected } = this.state;
    return (
      <Modal show={true} onHide={onCancel}>
        <Modal.Header closeButton={true}>
          { mode === 'update' ? 'Update' : 'Insert' } object reference
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="link-editor-text">Object reference</label>
              <ClickAwayListener onClickAway={() => { this.setState({ show: false }) }}>
                <div className="col-sm-8">
                  <input id="link-editor-text" type="text"
                         ref="link-editor-text"
                         className="form-control"
                         value={text}
                         onChange={({ target: { value } }) => {
                           this.setState({
                             text: value,
                             selectedIndex: 0
                           }, this.updateAutocomplete)}
                         }
                         onFocus={this.updateAutocomplete}
                         onKeyUp={this.handleKeyUp}
                         onKeyDown={this.handleAutocompleteListManagementKeys}
                         onClick={this.handleInputClick}
                  />
                  {
                    (this.state.show && document.activeElement === this.refs['link-editor-text']) ? (
                      <AutocompleteWidget items={items}
                                          selectedIndex={selectedIndex}
                                          onSelectItem={this.handleItemSelect}
                                          onSelectedIndexChange={this.handleSelectedIndexChange}
                                          isMouseIndexSelected={isMouseIndexSelected}
                                          styles={{
                                            width: this.refs['link-editor-text'].clientWidth,
                                            left: 15,
                                            top: 31
                                          }}
                      />
                    ) : null
                  }
                </div>
              </ClickAwayListener>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-link" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={onChange.bind(this, text)}>
            { mode === 'update' ? 'Update' : 'Insert' }
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ObjectReferenceEditor;
