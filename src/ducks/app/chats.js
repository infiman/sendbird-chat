let id = 0;

const APP_ADD_CHAT = 'sendbird-chat/chats/APP_ADD_CHAT';
export function addChat(payload = { id: id++ }) {
  return {
    payload,
    type: APP_ADD_CHAT,
  };
}

const APP_REMOVE_CHAT = 'sendbird-chat/chats/APP_REMOVE_CHAT';
export function removeChat(payload = {}) {
  return {
    payload,
    type: APP_REMOVE_CHAT,
  };
}

export default function chats(state = [], { type, payload }) {
  switch (type) {
    case APP_ADD_CHAT:
      return [...state, payload];
    case APP_REMOVE_CHAT:
      return state.filter(chat => chat.id !== payload.id);
    default:
      return state;
  }
}
