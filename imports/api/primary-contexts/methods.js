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

  deleteContext(_id) {
    check(_id, String);
    const context = PrimaryContexts.findOne(_id);
    pinecone.remove(_id, context.contextId);
    return PrimaryContexts.remove(_id);
  },

  updateContext(contextId, data) {
    check(contextId, String);
    check(data, Object);
    PrimaryContexts.update(contextId, { $set: data });
  },

  editContextText(contextId, text) {
    check(contextId, String);
    check(text, String);
    const context = PrimaryContexts.findOne(contextId);
    pinecone.update(contextId, context.contextId, text, 'primary');
    PrimaryContexts.update(contextId, { $set: { text } });
  },

});
