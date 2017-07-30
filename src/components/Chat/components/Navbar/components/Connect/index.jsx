import React from 'react';
import { connect } from 'react-redux';
import { createChatConversation } from '../../../../../../ducks/chat/conversations';
import Button from '../../../../../common/Button';
import Input from '../../../../../common/Input';

import './styles.css';

class Connect extends React.Component {
  state = {
    username: '',
  };

  onUsernameChange = username => {
    this.setState({ username });
  };

  get visibilityStyle() {
    return {
      display: this.props.isOpen ? 'flex' : 'none',
    };
  }

  createChatConversation = () => {
    const { username } = this.state;

    this.setState({ username: '' }, () => {
      this.props.createChatConversation({ userId: username });
    });
  };

  render() {
    return (
      <section className="chat-connect row" style={this.visibilityStyle}>
        <Input
          autofocus={true}
          onChange={this.onUsernameChange}
          onEnterPress={this.createChatConversation}
          placeholder="Username"
        >
          {this.state.username}
        </Input>
        <Button onClick={this.createChatConversation}>Add</Button>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createChatConversation: payload => dispatch(createChatConversation(payload)),
});

export default connect(() => ({}), mapDispatchToProps)(Connect);
