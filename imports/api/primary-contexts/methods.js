import { PrimaryContexts } from './collections';

Meteor.methods({
  addPrimaryContext(context, contextId) {
    check(context, {
      text: String,
      createdAt: Match.Optional(Date),
      status: Match.Optional(String),
      priority: Match.Optional(Number),
      dynContextId: Match.Optional(String),
    });
    check(contextId, String);

    PrimaryContexts.insert({
      userId: this.userId,
      contextId,
      text: context.text,
      createdAt: context.createdAt || new Date(),
      status: context.status || 'open',
      priority: context.priority || PrimaryContexts.find({ contextId }).count(),
      dynContextId: context.dynContextId,
    });
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
