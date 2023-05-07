import { Chats } from './collections.js';

Meteor.methods({
  addChat: function(contextId, role, message) {
    check(role, String); // 'user' or 'assistant'
    check(message, String);

    if(!this.userId) throw new Meteor.Error('not-authorized');
    if(!contextId) throw new Meteor.Error('no-context-id');

    message = message.replace(/\n/g, '<br>');

    Chats.insert({
      userId: this.userId,
      contextId,
      role: role,
      content: message,
      createdAt: new Date(),
    });
  },

  deleteChat: function(chatId) {
    check(chatId, String);
    Chats.remove(chatId);
  },

  removeAllChats: function() {
    Chats.remove({});
  },

});
