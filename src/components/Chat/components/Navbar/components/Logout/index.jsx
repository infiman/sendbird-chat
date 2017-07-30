import React from 'react';
import { connect } from 'react-redux';
import { destroyChatConnection } from '../../../../../../ducks/chat/currentUser';
import Button from '../../../../../common/Button';

import './styles.css';

class Logout extends React.Component {
  destroyChatConnection = () => {
    this.props.destroyChatConnection();
  };

  render() {
    return (
      <section className="chat-logout row">
        You are logged in as "{this.props.userId}"
        <Button onClick={this.destroyChatConnection}>Logout</Button>
      </section>
    );
  }
}

const mapStateToProps = ({ chat: { currentUser: { userId } } }) => ({ userId });

const mapDispatchToProps = dispatch => ({
  destroyChatConnection: payload => dispatch(destroyChatConnection(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
