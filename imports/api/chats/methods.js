import { Chats } from './collections.js';

Meteor.methods({
  addChat: function(role, message) {
    check(role, String); // 'user' or 'assistant'
    check(message, String);

    message = message.replace(/\n/g, '<br>');

    Chats.insert({
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
