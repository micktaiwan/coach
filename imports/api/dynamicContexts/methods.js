import { DynContexts } from './collections';

Meteor.methods({
  addDynContext(name) {
    check(name, String);

    if (!this.userId) throw new Meteor.Error('not-authorized');

    DynContexts.insert({
      name,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

});
