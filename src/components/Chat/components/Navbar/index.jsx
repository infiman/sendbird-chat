import React from 'react';
import { connect } from 'react-redux';
import { fetchChatConversationList } from '../../../../ducks/chat/conversations';
import Connect from './components/Connect';
import Conversation from './components/Conversation';
import Button from '../../../common/Button';
import Logout from './components/Logout';

import './styles.css';

class Navbar extends React.Component {
  state = {
    isConnectOpen: false,
  };

  onConnectOpen = () => {
    this.setState({
      isConnectOpen: !this.state.isConnectOpen,
    });
  };

  get conversations() {
    let conversations = [];
    Object.entries(this.props.conversations).forEach(
      ([key, value]) => conversations.push(
        <Conversation key={[key, Math.random()].join('-')} conversation={value} />,
      )
    );

    return conversations;
  }

  componentDidMount() {
    this.props.fetchChatConversationList();
  }

  render() {
    const { isConnectOpen } = this.state;

    return (
      <section className="chat-navbar chat-panel">
        <section className="chat-navbar-header row">
          <h4>Messages</h4>
          <Button
            className="chat-create-conversation"
            onClick={this.onConnectOpen}
          >
            {isConnectOpen ? <span>&#215;</span> : <span>&#43;</span>}
          </Button>
        </section>
        <Connect isOpen={isConnectOpen} />
        <section>
          {this.conversations}
        </section>
        <Logout />
      </section>
    );
  }
}

const mapStateToProps = ({ chat: { conversations } }) => {
  const { error, __state__, ...other } = conversations;

  return {
    conversations: other,
    error,
    __state__,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchChatConversationList: payload => dispatch(fetchChatConversationList(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
