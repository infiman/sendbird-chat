import React from 'react';
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import StoryView from './components/StoryView';
import Composer from './components/Composer';
import Login from './components/Login';

import './styles.css';

class Chat extends React.Component {
  get view() {
    return this.props.isChatInitialized ?
      <section className="chat-main row">
        <Navbar />
        <section>
          <StoryView />
          <Composer />
        </section>
      </section> :
      <Login />;
  }

  render() {
    return (
      <section className="chat">
        {this.view}
      </section>
    );
  }
}

const mapStateToProps = ({ chat: { currentUser: { __state__ } } }) => ({
  isChatInitialized: __state__ && __state__ === 1,
});

export default connect(
  mapStateToProps,
)(Chat);
