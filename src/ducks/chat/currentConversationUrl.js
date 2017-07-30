const CHAT_SET_CURRENT_CONVERSATION_URL = 'sendbird-chat/currentConversationUrl/CHAT_SET_CURRENT_CONVERSATION_URL';
export function setChatCurrentConversationUrl(payload = '') {
  return {
    payload,
    type: CHAT_SET_CURRENT_CONVERSATION_URL,
  };
}

const CHAT_CURRENT_CONVERSATION_URL_DESTROYED = 'sendbird-chat/currentConversationUrl/CHAT_CURRENT_CONVERSATION_URL_DESTROYED';
export function destroyedCurrentConversationUrl(payload = '') {
  return {
    payload,
    type: CHAT_CURRENT_CONVERSATION_URL_DESTROYED,
  };
}

const initialState = '';

export default function currentConversationUrl(state = initialState, { type, payload }) {
  switch (type) {
    case CHAT_SET_CURRENT_CONVERSATION_URL:
      return payload;
    case CHAT_CURRENT_CONVERSATION_URL_DESTROYED:
      return initialState;
    default:
      return state;
  }
}
