import React from 'react';
import { connect } from 'react-redux';
import { initializeChatConnection } from '../../../../ducks/chat/currentUser';
import Button from '../../../common/Button';
import Input from '../../../common/Input';

import './styles.css';

class Login extends React.Component {
  state = {
    username: '',
  };

  onUsernameChange = username => {
    this.setState({ username });
  };

  initializeChatConnection = () => {
    const { username } = this.state;

    this.setState({ username: '' }, () => {
      this.props.initializeChatConnection({ userId: username });
    });
  };

  render() {
    return (
      <section className="chat-login chat-panel row">
        <Input
          autofocus={true}
          onChange={this.onUsernameChange}
          onEnterPress={this.initializeChatConnection}
          placeholder="Username"
        >
          {this.state.username}
        </Input>
        <Button onClick={this.initializeChatConnection}>Login</Button>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  initializeChatConnection: payload => dispatch(initializeChatConnection(payload)),
});

export default connect(() => ({}), mapDispatchToProps)(Login);
