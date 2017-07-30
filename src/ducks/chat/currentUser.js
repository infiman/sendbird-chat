import ChatService from '../../services/chat';
import { receivedMessage } from './messages';
import { updatedConversation, updatedConversationTyping, destroyedConversations } from './conversations';
import { destroyedCurrentConversationUrl } from './currentConversationUrl';
import { destroyedMessages } from './messages';

const CHAT_CURRENT_USER_INITIALIZE = 'sendbird-chat/currentUser/CHAT_CURRENT_USER_INITIALIZE';
function initializeChat(payload = {}) {
  return {
    payload,
    type: CHAT_CURRENT_USER_INITIALIZE,
  };
}

const CHAT_CURRENT_USER_INITIALIZED = 'sendbird-chat/currentUser/CHAT_CURRENT_USER_INITIALIZED';
function initializedChat(payload = {}) {
  return {
    payload,
    type: CHAT_CURRENT_USER_INITIALIZED,
  };
}

const CHAT_CURRENT_USER_UNINITIALIZED = 'sendbird-chat/currentUser/CHAT_CURRENT_USER_UNINITIALIZED';
function uninitializedChat(payload = {}) {
  return {
    payload,
    type: CHAT_CURRENT_USER_UNINITIALIZED,
  };
}

export function initializeChatConnection(payload = {}) {
  return dispatch => {
    dispatch(
      initializeChat(
        Object.assign({}, payload, {
          __state__: 0,
        }),
      ),
    );

    if (!payload.userId) {
      return dispatch(
        uninitializedChat(
          Object.assign({}, payload, {
            error: {
              message: `"userId" is ""${payload.userId}".`,
              name: 'ChatServiceException',
              code: 666,
            },
            __state__: 0,
          }),
        ),
      );
    }

    return ChatService.connect(
      payload.userId,
    ).then(
      currentUser => {
        dispatch(
          initializedChat(
            Object.assign(currentUser, {
              __state__: 1,
            }),
          ),
        );

        ChatService.subscribeForMessageReceived(currentUser.userId, (conversation, message) => {
          dispatch(
            receivedMessage(message),
          );
        });
        ChatService.subscribeForChannelChanged(currentUser.userId, conversation => {
          dispatch(
            updatedConversation(conversation),
          );
        });
        ChatService.subscribeForTyping(currentUser.userId, conversation => {
          dispatch(
            updatedConversationTyping(Object.assign(conversation, { __isTyping__: conversation.isTyping() })),
          );
        });
      }
    ).catch(
      error => dispatch(
        uninitializedChat({ error, __state__: 0 }),
      ),
    );
  };
}

const CHAT_CURRENT_USER_DESTROY = 'sendbird-chat/currentUser/CHAT_CURRENT_USER_DESTROY';
function destroyChat(payload = {}) {
  return {
    payload,
    type: CHAT_CURRENT_USER_DESTROY,
  };
}

const CHAT_CURRENT_USER_DESTROYED = 'sendbird-chat/currentUser/CHAT_CURRENT_USER_DESTROYED';
function destroyedChat(payload = {}) {
  return {
    payload,
    type: CHAT_CURRENT_USER_DESTROYED,
  };
}

export function destroyChatConnection(payload = {}) {
  return dispatch => {
    dispatch(
      destroyChat(
        Object.assign({}, payload, {
          __state__: 0,
        }),
      ),
    );

    return ChatService.disconnect().then(
      () => {
        dispatch(destroyedCurrentConversationUrl(payload));
        dispatch(destroyedConversations(payload));
        dispatch(destroyedMessages(payload));
        dispatch(destroyedChat(payload));
      },
    );
  };
}

const initialState = {
  __state__: 0,
};

export default function currentUser(state = initialState, { type, payload }) {
  switch (type) {
    case CHAT_CURRENT_USER_INITIALIZE:
      return Object.assign({}, state, payload);
    case CHAT_CURRENT_USER_INITIALIZED:
      return Object.assign({}, state, payload);
    case CHAT_CURRENT_USER_UNINITIALIZED:
      return Object.assign({}, state, payload);
    case CHAT_CURRENT_USER_DESTROY:
      return Object.assign({}, state, payload);
    case CHAT_CURRENT_USER_DESTROYED:
      return initialState;
    default:
      return state;
  }
}
