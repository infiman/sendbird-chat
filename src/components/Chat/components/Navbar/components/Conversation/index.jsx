import React from 'react';
import { connect } from 'react-redux';
import { setChatCurrentConversationUrl } from '../../../../../../ducks/chat/currentConversationUrl';

import './styles.css';

class Conversation extends React.Component {
  setChatCurrentConversationUrl = () => {
    const { conversation } = this.props;

    this.props.setChatCurrentConversationUrl(conversation.url);
  };

  get interlocutor() {
    return this.props.conversation.members.filter(
      member => member.userId !== this.props.userId,
    )[0];
  }

  get statusMessage() {
    const { lastMessage } = this.props.conversation;
    const createdAt = lastMessage ? lastMessage.createdAt : this.props.conversation.createdAt;
    const message = lastMessage ? lastMessage.message : 'Start messaging after a click';

    return this.props.conversation.__isTyping__ ?
      (
        <section>
          <div className="typing-dots">
            <div></div>
          </div>
        </section>
      ) :
      (
        <section className='chat-last-message row'>
          <span className="chat-last-message-wrap">{message}</span>
          <span>
            {
              new Date(
                createdAt,
              ).toLocaleTimeString(
                'en-US',
                {
                  hour: 'numeric',
                  hour12: true,
                  minute: 'numeric',
                },
              )
            }
          </span>
        </section>
      );
  }

  isActive () {
    return this.props.currentConversationUrl === this.props.conversation.url;
  }

  render() {
    const { userId, profileUrl } = this.interlocutor;
    const { unreadMessageCount } = this.props.conversation;

    return (
      <section
        className={`chat-conversation row${this.isActive() ? ' active' : ''}`}
        onClick={this.setChatCurrentConversationUrl}
      >
        <img src={profileUrl} className="chat-members-photo" alt="profileUrl"></img>
        <section>
          <span className="chat-interlocutor-wrap">
            {userId} {unreadMessageCount ? `(${unreadMessageCount})` : null}
          </span>
          {this.statusMessage}
        </section>
      </section>
    );
  }
}

const mapStateToProps = ({
  chat: {
    currentConversationUrl,
    currentUser: { userId },
  },
}) => ({
  userId,
  currentConversationUrl,
});

const mapDispatchToProps = dispatch => ({
  setChatCurrentConversationUrl: payload => dispatch(setChatCurrentConversationUrl(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
