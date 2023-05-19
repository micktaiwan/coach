import { Chats } from './collections';
import { pinecone } from '../pinecone/pinecone';

Meteor.methods({
  addChat(contextId, role, message) {
    check(contextId, String);
    check(role, String); // 'user', 'assistant', 'meta'
    check(message, String);

    if (!this.userId) throw new Meteor.Error('not-authorized');
    if (!contextId) throw new Meteor.Error('no-context-id');

    message = message.replace(/\n/g, '<br>');

    Chats.insert({
      userId: this.userId,
      contextId,
      role,
      content: message,
      createdAt: new Date(),
    });

    // Pinecone
    const id = pinecone.addChat(contextId, role, message);
    console.log('Pinecone chat id:', id);
  },

  deleteChat(chatId) {
    check(chatId, String);
    Chats.remove(chatId);
  },

  removeAllChats(contextId) {
    check(contextId, String);
    Chats.remove({ contextId, userId: this.userId });
  },

});
