import { getState } from '../config/store';

export const getMessages = () => {
  return getState().chat.messages;
}

export const getMessagesByConversationUrl = url => {
  return getMessages()[url] || [];
}
