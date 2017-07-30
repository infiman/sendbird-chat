import ChatService from '../../services/chat';
import { getConverstationByUrl } from '../../selectors/conversations';

const CHAT_CONVERSATION_CREATE = 'sendbird-chat/conversations/CHAT_CONVERSATION_CREATE';
function createConversation(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATION_CREATE,
  };
}

const CHAT_CONVERSATION_CREATED = 'sendbird-chat/conversations/CHAT_CONVERSATION_CREATED';
function createdConversation(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATION_CREATED,
  };
}

const CHAT_CONVERSATION_FETCH_FAILED = 'sendbird-chat/conversations/CHAT_CONVERSATION_FETCH_FAILED';
function failedConversation(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATION_FETCH_FAILED,
  };
}

export function createChatConversation(payload = {}) {
  return dispatch => {
    dispatch(
      createConversation({
        __state__: 0,
      }),
    );

    return ChatService.createConversation(
      payload.userId,
    ).then(
      conversation => dispatch(
        createdConversation({
          [conversation.url]: conversation,
          __state__: 1,
        }),
      ),
    ).catch(
      error => dispatch(
        failedConversation({ error, __state__: 1 }),
      ),
    );
  };
}

const CHAT_CONVERSATIONS_FETCH = 'sendbird-chat/conversations/CHAT_CONVERSATIONS_FETCH';
function fetchConversationList(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATIONS_FETCH,
  };
}

const CHAT_CONVERSATIONS_FETCHED = 'sendbird-chat/conversations/CHAT_CONVERSATIONS_FETCHED';
function fetchedConversationList(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATIONS_FETCHED,
  };
}

const CHAT_CONVERSATIONS_FETCH_FAILED = 'sendbird-chat/conversations/CHAT_CONVERSATIONS_FETCH_FAILED';
function failedConversationList(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATIONS_FETCH_FAILED,
  };
}

export function fetchChatConversationList(payload = {}) {
  return dispatch => {
    dispatch(
      fetchConversationList({
        __state__: 0,
      }),
    );

    ChatService.fetchConversationList().then(
      conversationsList => {
        const list = conversationsList.map(
          conversation => ({
            [conversation.url]: conversation,
          }),
        );

        dispatch(
          fetchedConversationList(
            Object.assign({ __state__: 1 }, ...list),
          ),
        );
      },
    ).catch(
      error => dispatch(
        failedConversationList({ error, __state__: 1 }),
      ),
    );
  }
}

const CHAT_CONVERSATION_UPDATED = 'sendbird-chat/conversations/CHAT_CONVERSATION_UPDATED';
export function updatedConversation(payload = {}) {
  return {
    payload: { [payload.url]: payload },
    type: CHAT_CONVERSATION_UPDATED,
  }
}

const CHAT_CONVERSATIONS_LAST_MESSAGE_UPDATED = 'sendbird-chat/conversations/CHAT_CONVERSATIONS_LAST_MESSAGE_UPDATED';
export function updatedConversationsLastMessage(payload = {}) {
  const { message, message: { channelUrl } } = payload;

  return {
    payload: { [channelUrl]: Object.assign(
      {},
      getConverstationByUrl(channelUrl),
      { lastMessage: message },
    )},
    type: CHAT_CONVERSATIONS_LAST_MESSAGE_UPDATED,
  };
}

const CHAT_CONVERSATION_TYPING_UPDATED = 'sendbird-chat/conversations/CHAT_CONVERSATION_TYPING_UPDATED';
export function updatedConversationTyping(payload = {}) {
  return {
    payload: { [payload.url]: payload },
    type: CHAT_CONVERSATION_TYPING_UPDATED,
  };
}

const CHAT_CONVERSATION_START_TYPING = 'sendbird-chat/conversations/CHAT_CONVERSATION_START_TYPING';
export function startTyping(payload = '') {
  ChatService.startTyping(payload);

  return {
    payload,
    type: CHAT_CONVERSATION_START_TYPING,
  };
}

const CHAT_CONVERSATION_END_TYPING = 'sendbird-chat/conversations/CHAT_CONVERSATION_END_TYPING';
export function endTyping(payload = '') {
  ChatService.endTyping(payload);

  return {
    payload,
    type: CHAT_CONVERSATION_END_TYPING,
  };
}

const CHAT_CONVERSATIONS_DESTROYED = 'sendbird-chat/conversations/CHAT_CONVERSATIONS_DESTROYED';
export function destroyedConversations(payload = {}) {
  return {
    payload,
    type: CHAT_CONVERSATIONS_DESTROYED,
  };
}

const initialState = {
  __state__: 0,
};

export default function conversations(state = initialState, { type, payload }) {
  switch (type) {
    case CHAT_CONVERSATION_CREATE:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATION_CREATED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATION_FETCH_FAILED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATIONS_FETCH:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATIONS_FETCHED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATIONS_FETCH_FAILED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATION_UPDATED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATIONS_LAST_MESSAGE_UPDATED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATION_TYPING_UPDATED:
      return Object.assign({}, state, payload);
    case CHAT_CONVERSATION_START_TYPING:
      return state;
    case CHAT_CONVERSATION_END_TYPING:
      return state;
    case CHAT_CONVERSATIONS_DESTROYED:
      return initialState;
    default:
      return state;
  }
}
