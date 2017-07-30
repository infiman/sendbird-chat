import React from 'react';
import { connect } from 'react-redux';

import './styles.css';

class Message extends React.Component {
  getPositionStyles(userId) {
    return {
      flexDirection: this.props.currentUserId === userId ? 'row-reverse' : 'row',
    };
  }

  render() {
    const {
      _sender: {
        userId,
        profileUrl,
      },
      message,
    } = this.props.message;

    return (
      <section className="chat-message row" style={this.getPositionStyles(userId)}>
        <section className="chat-message-sender">
          <img src={profileUrl} className="chat-members-photo" alt="profileUrl"></img>
        </section>
        <section className="chat-message-text">
          {message}
        </section>
      </section>
    );
  }
}

const mapStateToProps = ({
  chat: {
    currentUser: {
      userId,
    },
  },
}) => ({
  currentUserId: userId,
});

export default connect(mapStateToProps)(Message);
