import { PrimaryContexts } from './collections.js';
import _ from 'underscore';

Meteor.methods({
  addPrimaryContext: function(context, contextId) {
    check(context, Object);
    check(context.text, String);
    check(contextId, String);

    PrimaryContexts.insert({
      userId: this.userId,
      contextId,
      text: context.text,
      createdAt: context.createdAt || new Date(),
      status: context.status || 'open',
      priority: context.priority || PrimaryContexts.find({contextId: contextId}).count(),
    });
  },

  deleteContext: function(contextId) {
    check(contextId, String);
    PrimaryContexts.remove(contextId);
  },

  updateContext: function(contextId, data) {
    check(contextId, String);
    check(data, Object);
    PrimaryContexts.update(contextId, { $set: data });
  },

  editContextText: function(contextId, text) {
    check(contextId, String);
    check(text, String);
    PrimaryContexts.update(contextId, { $set: { text: text } });
  }

});
