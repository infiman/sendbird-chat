import React from 'react';

import './styles.css';

class Button extends React.Component {
  onChange = e => {
    this.props.onChange(e.currentTarget.value);
  };

  onKeyPress = e => {
    if(e.key === 'Enter'){
      this.props.onEnterPress();
    }
  }

  render() {
    return (
      <input
        autoFocus={this.props.autofocus}
        placeholder={this.props.placeholder}
        value={this.props.children}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        className={`input${this.props.className ? ` ${this.props.className}` : ''}`}
      />
    );
  }
}

export default Button;
