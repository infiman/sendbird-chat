import React from 'react';

import './styles.css';

class Button extends React.Component {
  render() {
    return (
      <a
        role="button"
        onClick={this.props.onClick}
        className={`black-button${this.props.className ? ` ${this.props.className}` : ''}`}
      >
        {this.props.children}
      </a>
    );
  }
}

export default Button;
