import { combineReducers } from 'redux';
import currentUser from './currentUser';
import messages from './messages';
import conversations from './conversations';
import currentConversationUrl from './currentConversationUrl';

export default combineReducers({
  messages,
  conversations,
  currentUser,
  currentConversationUrl,
});
