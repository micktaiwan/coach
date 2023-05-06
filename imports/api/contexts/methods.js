import { Contexts } from './collections.js';
import _ from 'underscore';

Meteor.methods({
  addContext: function(context) {
    check(context, Object);
    check(context.text, String);

    Contexts.insert({
      text: context.text,
      createdAt: new Date(),
      status: 'open',
      priority: context.priority || Contexts.find().count(),
      ..._.omit(context, ['text', 'priority'])
    });
  },

  deleteContext: function(contextId) {
    check(contextId, String);
    Contexts.remove(contextId);
  },

  updateContext: function(contextId, data) {
    check(contextId, String);
    check(data, Object);
    Contexts.update(contextId, { $set: data });
  },

  editContextText: function(contextId, text) {
    check(contextId, String);
    check(text, String);
    Contexts.update(contextId, { $set: { text: text } });
  }

});
