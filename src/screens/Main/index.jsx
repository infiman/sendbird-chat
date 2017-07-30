import React, { Component } from 'react';
import ChatManager from '../../components/ChatManager';
import './style.css';

class Main extends Component {
  componentWillMount() {
    let isInIframe = false;

    try {
      isInIframe = window.self !== window.top;
    } catch (e) {
      isInIframe = true;
    }

    this.setState({ isInIframe });
  }

  render() {
    return <ChatManager isInIframe={this.state.isInIframe} />;
  }
}

export default Main;
