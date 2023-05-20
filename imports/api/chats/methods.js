import { Chats } from './collections';
import { pinecone } from '../pinecone/pinecone';

Meteor.methods({
  addChat(contextId, role, content) {
    check(contextId, String);
    check(role, String); // 'user', 'assistant', 'meta'
    check(content, String);

    if (!this.userId) throw new Meteor.Error('not-authorized');
    if (!contextId) throw new Meteor.Error('no-context-id');

    content = content.replace(/\n/g, '<br>');

    const chat = {
      userId: this.userId,
      contextId,
      role,
      content,
      createdAt: new Date(),
    };

    Chats.insert(chat);
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
