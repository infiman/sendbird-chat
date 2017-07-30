import Sendbird from 'sendbird';

const config = {
  appId: 'ADCFE1DF-0725-4CE4-8018-5FAEF862C665',
};

class ChatService {
  constructor(optConfig = {}) {
    this._sb = new Sendbird(Object.assign({}, config, optConfig));
    this._handlerIds = [];
  }

  connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.connect(userId, (user, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(user);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      try {
        this._sb.disconnect(() => {
          this._handlerIds.forEach(handlerId => {
            this._sb.removeChannelHandler(handlerId);
          });

          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  fetchConversationList() {
    return new Promise((resolve, reject) => {
      try {
        let conversationListQuery = this._sb.GroupChannel.createMyGroupChannelListQuery();
        conversationListQuery.includeEmpty = true;
        conversationListQuery.limit = 100;

        if (conversationListQuery.hasNext) {
          conversationListQuery.next((conversationList, error) => {
            if (error) {
              reject(error);
            } else {
              resolve(conversationList);
            }
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  fetchMessageList(conversationUrl) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.GroupChannel.getChannel(conversationUrl, (conversation, error) => {
          if (error) {
            reject(error);
          } else {
            const messageListQuery = conversation.createPreviousMessageListQuery();

            messageListQuery.load(100, true, (messageList, error) => {
              if (error) {
                reject(error);
              } else {
                resolve(messageList);
              }
            });
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  createConversation(userId) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.GroupChannel.createChannelWithUserIds(
          [userId],
          true,
          `Conversation between "${userId}" and "${this._sb.currentUser.userId}"`,
          '',
          '',
          '',
          (createdConversation, error) => {
            if (error) {
              reject(error);
            } else {
              resolve(createdConversation);
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  sendMessage(conversationUrl, messageText) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.GroupChannel.getChannel(conversationUrl, (conversation, error) => {
          if (error) {
            reject(error);
          } else {
            conversation.sendUserMessage(
              messageText,
              '',
              '',
              (message, error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(message);
                }
              }
            );
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  startTyping(conversationUrl) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.GroupChannel.getChannel(conversationUrl, (conversation, error) => {
          if (error) {
            reject(error);
          } else {
            conversation.startTyping();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  endTyping(conversationUrl) {
    return new Promise((resolve, reject) => {
      try {
        this._sb.GroupChannel.getChannel(conversationUrl, (conversation, error) => {
          if (error) {
            reject(error);
          } else {
            conversation.endTyping();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  subscribeForMessageReceived(id, callback) {
    const conversationHandler = new this._sb.ChannelHandler();
    const handlerId = id + Math.random();

    conversationHandler.onMessageReceived = callback;

    this._sb.addChannelHandler(handlerId, conversationHandler);

    this._handlerIds.push(handlerId);
  }

  subscribeForChannelChanged(id, callback) {
    const conversationHandler = new this._sb.ChannelHandler();
    const handlerId = id + Math.random();

    conversationHandler.onChannelChanged = callback;

    this._sb.addChannelHandler(handlerId, conversationHandler);

    this._handlerIds.push(handlerId);
  }

  subscribeForTyping(id, callback) {
    const conversationHandler = new this._sb.ChannelHandler();
    const handlerId = id + Math.random();

    conversationHandler.onTypingStatusUpdated = callback;

    this._sb.addChannelHandler(handlerId, conversationHandler);

    this._handlerIds.push(handlerId);
  }
}

export default new ChatService();
