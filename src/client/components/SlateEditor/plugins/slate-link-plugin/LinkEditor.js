import React from 'react';
import {Modal} from 'react-bootstrap';

/**
 * Editor for link fields: href & text
 */
class LinkEditor extends React.Component {
  state = {
    text: this.props.text,
    href: this.props.href,
    isAutocompleteOverlayVisible: false
  };

  componentWillReceiveProps = (nextProps) => {
    const {text, href} = nextProps;

    if (text !== this.state.text) {
      this.setState({text});
    }

    if (href !== this.state.href) {
      this.setState({href});
    }
  };

  handleChange = () => {
    const {text, href} = this.state;
    if (text && href) {
      const {onChange} = this.props;
      onChange({text, href});
    }
  };

  render() {
    const {mode, onCancel, autoCompletionLinks = []} = this.props;
    const {text, href, isAutocompleteOverlayVisible} = this.state;

    const title = mode === 'insert' ? 'Insert link' : 'Update Link';
    const autocompleteListStyles = {
      position: 'absolute',
      zIndex: 99999,
      display: 'block',
      left: 15,
      top: 32
    };
    return (
      <Modal show onHide={onCancel}>
        <Modal.Header closeButton={true}>
          {title}
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="link-editor-text">Text</label>
              <div className="col-sm-8">
                <input id="link-editor-text" type="text"
                       className="form-control"
                       value={text}
                       onChange={({target: {value}}) => this.setState({text: value, isAutocompleteOverlayVisible: true})}
                       onFocus={() => this.setState({ isAutocompleteOverlayVisible: true })} />
                {(autoCompletionLinks.length && isAutocompleteOverlayVisible) ? (
                    <ul className="dropdown-menu textcomplete-dropdown"
                        style={autocompleteListStyles}>
                      {
                        autoCompletionLinks.map((autoCompletionLink, index) => {
                          return (
                            <li key={index}
                                onClick={() => {
                                  this.setState({
                                    href: autoCompletionLink.url,
                                    text: autoCompletionLink.text,
                                    isAutocompleteOverlayVisible: false
                                  })
                                }}
                                className="textcomplete-item">
                              <a href="javascript:void(0)">{autoCompletionLink.text}</a>
                            </li>
                          );
                        })
                      }
                    </ul>
                  ) : null}
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="link-editor-href">Link</label>
              <div className="col-sm-8">
                <input id="link-editor-href" type="text"
                       className="form-control"
                       value={href}
                       onChange={({target: {value}}) => this.setState({href: value})}/>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-link" onClick={onCancel}>
            Cancel
          </button>

          {mode === 'insert' ? (
            <button className="btn btn-primary" onClick={this.handleChange}>
              Insert
            </button>
          ) : null}

          {mode === 'update' ? (
            <button className="btn btn-primary" onClick={this.handleChange}>
              Update
            </button>
          ) : null}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LinkEditor;