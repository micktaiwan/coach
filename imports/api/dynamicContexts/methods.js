import { DynContexts } from './collections';

Meteor.methods({
  addDynContext(name, contextId) {
    check(name, String);
    check(contextId, String);

    if (!this.userId) throw new Meteor.Error('not-authorized');

    DynContexts.insert({
      name,
      contextId,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

});
