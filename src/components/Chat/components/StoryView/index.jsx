import React from 'react';
import { connect } from 'react-redux';
import { fetchChatMessageList } from '../../../../ducks/chat/messages';
import Message from './components/Message';

import './styles.css';

class StoryView extends React.Component {
  fetchChatMessageList = conversationUrl => {
    this.props.fetchChatMessageList({ conversationUrl });
  }

  get typingVisibilityStyles() {
    return {
      display: this.props.currentConversation.__isTyping__ ? 'block' : 'none',
    };
  }

  get messages() {
    let messages = [];

    this.props.messages.forEach(message => {
      messages.push(
        <Message key={[message.messageId, Math.random()].join('-')} message={message} />
      );
    });

    return messages;
  }

  get dots() {
    return this.props.currentConversation.__isTyping__ ?
      (
        <div className="typing-dots">
          <div></div>
        </div>
      ) :
      null;
  }

  get view() {
    return this.props.currentConversationUrl ?
      (
        <section className="chat-story-messages">
          {this.dots}
          {this.messages}
        </section>
      ) :
      (
        <section className="chat-story-view-advice">
          <h1>
            &#8592; Please select any conversation from sidebar to display here.
          </h1>
        </section>
      );
  }

  componentWillReceiveProps({ currentConversationUrl }) {
    if (currentConversationUrl !== this.props.currentConversationUrl) {
      this.fetchChatMessageList(currentConversationUrl);
    }
  }

  render() {
    return (
      <section className="chat-story-view">
        <section className="chat-story-title chat-panel">
          <h4>
            {this.props.currentConversation.name || 'SendBird PoC'}
          </h4>
        </section>
        {this.view}
      </section>
    );
  }
}

const mapStateToProps = ({ chat: { conversations, currentConversationUrl, messages } }) => ({
  conversations,
  currentConversationUrl,
  currentConversation: conversations[currentConversationUrl] || {},
  messages: messages[currentConversationUrl] || [],
});

const mapDispatchToProps = dispatch => ({
  fetchChatMessageList: payload => dispatch(fetchChatMessageList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoryView);
