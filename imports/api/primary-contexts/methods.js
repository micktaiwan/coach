import { PrimaryContexts } from './collections';
import { pinecone } from '../pinecone/pinecone';

Meteor.methods({
  addPrimaryContext(context, contextId) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    check(context, {
      text: String,
      createdAt: Match.Optional(Date),
      status: Match.Optional(String),
      priority: Match.Optional(Number),
      dynContextId: Match.Optional(String),
    });
    check(contextId, String);

    const p = {
      userId: this.userId,
      contextId,
      text: context.text,
      createdAt: context.createdAt || new Date(),
      status: context.status || 'open',
      priority: context.priority || PrimaryContexts.find({ contextId }).count(),
      dynContextId: context.dynContextId,
    };

    const _id = PrimaryContexts.insert(p);

    pinecone.addContext({
      _id,
      contextId,
      text: context.text,
      type: 'primary',
    });

    return _id;
  },

  deleteContext(contextId) {
    check(contextId, String);
    PrimaryContexts.remove(contextId);
  },

  updateContext(contextId, data) {
    check(contextId, String);
    check(data, Object);
    PrimaryContexts.update(contextId, { $set: data });
  },

  editContextText(contextId, text) {
    check(contextId, String);
    check(text, String);
    PrimaryContexts.update(contextId, { $set: { text } });
  },

});
