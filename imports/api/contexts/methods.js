import { Contexts } from './collections';

Meteor.methods({
  addContext(name) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    check(name, String);

    return Contexts.insert({
      userId: this.userId,
      name,
      createdAt: new Date(),
    });
  },
});
