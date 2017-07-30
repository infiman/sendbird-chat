import React from 'react';
import { connect } from 'react-redux';
import { addChat, removeChat } from '../../ducks/app/chats';
import { destroyChatConnection } from '../../ducks/chat/currentUser';
import Chat from '../Chat';
import Button from '../common/Button';

import './styles.css';

const APP_HOST = process.env.NODE_ENV === 'production' ?
  'https://infiman.github.io/sendbird-chat/' :
  'http://localhost:3000';

class ChatManager extends React.Component {
  addChat = () => {
    this.props.addChat();
  };

  removeChat = id => {
    return () => {
      this.props.removeChat({ id });
    }
  };

  get iframes() {
    let iframes = [];

    this.props.chats.forEach(chat => {
      iframes.push(
        <section key={[chat.id, Math.random].join('-')} className="chat-iframe-wrapper">
          <section key={[chat.id, Math.random].join('-')} className="chat-iframe">
            <iframe src={APP_HOST} width="100%" height="750px" title={chat.id}></iframe>
            <Button onClick={this.removeChat(chat.id)}>Remove this chat</Button>
          </section>
        </section>
      );
    });

    return iframes;
  }

  get view() {
    return this.props.isInIframe ?
      <Chat /> :
      (
        <section className="chat-manager-wrapper">
          <section className="chat-manager">
            {this.iframes}
            <Button onClick={this.addChat}>Add new chat</Button>
          </section>
        </section>
      );
  }

  componentWillUnmount() {
    this.props.destroyChatConnection();
  }

  render() {
    return <section>{this.view}</section>;
  }
}

const mapStateToProps = ({ app: { chats } }) => ({ chats });

const mapDispatchToProps = dispatch => ({
  addChat: payload => dispatch(addChat(payload)),
  removeChat: payload => dispatch(removeChat(payload)),
  destroyChatConnection: payload => dispatch(destroyChatConnection(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatManager);
