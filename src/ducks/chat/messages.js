import _ from 'lodash';
import ChatService from '../../services/chat';
import { updatedConversationsLastMessage } from './conversations';
import { getMessagesByConversationUrl } from '../../selectors/messages';

const CHAT_MESSAGE_SEND = 'sendbird-chat/messages/CHAT_MESSAGE_SEND';
function sendMessage(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGE_SEND,
  };
}

const CHAT_MESSAGE_SENT = 'sendbird-chat/messages/CHAT_MESSAGE_SENT';
function sentMessage(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGE_SENT,
  };
}

const CHAT_MESSAGE_SEND_FAILED = 'sendbird-chat/messages/CHAT_MESSAGE_SEND_FAILED';
function failedMessage(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGE_SEND_FAILED,
  };
}

export function sendChatMessage(payload = {}) {
  return dispatch => {
    dispatch(
      sendMessage({
        __state__: 0,
      }),
    );

    ChatService.sendMessage(payload.conversationUrl, payload.messageText).then(
      message => {
        const { channelUrl } = message;

        dispatch(
          updatedConversationsLastMessage({ message }),
        );

        dispatch(
          sentMessage({
            [channelUrl]: [
              message,
              ...getMessagesByConversationUrl(channelUrl)
            ],
            __state__: 1,
          }),
        );
      },
    ).catch(
      error => dispatch(
        failedMessage({ error, __state__: 1 }),
      ),
    );
  }
}

const CHAT_MESSAGE_RECEIVED = 'sendbird-chat/messages/CHAT_MESSAGE_RECEIVED';
export function receivedMessage(payload = {}) {
  const { channelUrl } = payload;

  return {
    payload: {
      [channelUrl]: [
        payload,
        ...getMessagesByConversationUrl(channelUrl),
      ],
    },
    type: CHAT_MESSAGE_RECEIVED,
  }
}

const CHAT_MESSAGES_FETCH = 'sendbird-chat/messages/CHAT_MESSAGES_FETCH';
function fetchMessageList(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGES_FETCH,
  };
}

const CHAT_MESSAGES_FETCHED = 'sendbird-chat/messages/CHAT_MESSAGES_FETCHED';
function fetchedMessageList(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGES_FETCHED,
  };
}

const CHAT_MESSAGES_FETCH_FAILED = 'sendbird-chat/messages/CHAT_MESSAGES_FETCH_FAILED';
function failedMessageList(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGES_FETCH_FAILED,
  };
}

export function fetchChatMessageList(payload = {}) {
  return dispatch => {
    const { conversationUrl } = payload;

    dispatch(
      fetchMessageList({
        __state__: 0,
      }),
    );

    ChatService.fetchMessageList(conversationUrl).then(
      messagesList => dispatch(
        fetchedMessageList({
          [conversationUrl]: _.unionBy(messagesList, getMessagesByConversationUrl(conversationUrl), 'messageId'),
          __state__: 1,
        }),
      ),
    ).catch(
      error => dispatch(
        failedMessageList({ error, __state__: 1 }),
      ),
    );
  }
}

const CHAT_MESSAGES_DESTROYED = 'sendbird-chat/messages/CHAT_MESSAGES_DESTROYED';
export function destroyedMessages(payload = {}) {
  return {
    payload,
    type: CHAT_MESSAGES_DESTROYED,
  };
}

const initialState = {
  __state__: 0,
};

export default function messages(state = initialState, { type, payload }) {
  switch (type) {
    case CHAT_MESSAGE_SEND:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGE_SENT:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGE_SEND_FAILED:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGE_RECEIVED:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGES_FETCH:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGES_FETCHED:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGES_FETCH_FAILED:
      return Object.assign({}, state, payload);
    case CHAT_MESSAGES_DESTROYED:
      return initialState;
    default:
      return state;
  }
}
