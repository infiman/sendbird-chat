import React, { Component } from 'react';
import logo from '../../assets/logo.svg';
import './style.css';

class Main extends Component {
  render() {
    return (
      <div className="Main">
        <div className="Main-header">
          <img src={logo} className="Main-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="Main-intro">
          To get started, edit <code>src/Main.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Main;
