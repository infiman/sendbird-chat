import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage } from '../../../../ducks/chat/messages';
import { startTyping, endTyping } from '../../../../ducks/chat/conversations';
import Input from '../../../common/Input';
import Button from '../../../common/Button';

import './styles.css';

class Composer extends React.Component {
  state = {
    messageText: '',
    typing: false,
  };

  typingTimeout = -1;
  typingTimeoutTime = 1000;

  onMessageChange = messageText => {
    this.setState({ messageText }, () => {
      this.startTyping();
    });
  };

  startTyping = () => {
    this.setState({ typing: true }, () => {
      this.props.startTyping(this.props.currentConversationUrl);
      this.timeoutTick();
    });
  }

  endTyping = () => {
    this.setState({ typing: false }, () => {
      this.props.endTyping(this.props.currentConversationUrl);
    });
  }

  timeoutTick = () => {
    window.clearTimeout(this.typingTimeout);

    this.typingTimeout = window.setTimeout(this.endTyping, this.typingTimeoutTime);
  }

  sendChatMessage = () => {
    const { messageText } = this.state;

    this.setState({ messageText: '' }, () => {
      this.props.sendChatMessage({
        messageText,
        conversationUrl: this.props.currentConversationUrl,
      });
    });
  };

  get isDisabled() {
    return !this.props.currentConversationUrl;
  }

  render() {
    return (
      <section className={`chat-composer chat-panel row${this.isDisabled ? ' disabled' : ''}`}>
        <Input
          onChange={this.onMessageChange}
          onEnterPress={this.sendChatMessage}
          placeholder="Your message..."
        >
          {this.state.messageText}
        </Input>
        <Button onClick={this.sendChatMessage}>Send</Button>
      </section>
    );
  }
}

const mapStateToProps = ({ chat: { currentConversationUrl } }) => ({ currentConversationUrl });

const mapDispatchToProps = dispatch => ({
  sendChatMessage: payload => dispatch(sendChatMessage(payload)),
  startTyping: payload => dispatch(startTyping(payload)),
  endTyping: payload => dispatch(endTyping(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Composer);
