import { Contexts } from './collections.js';

Meteor.methods({
  addContext: function(name) {
    check(name, String);

    Contexts.insert({
      userId: this.userId,
      name,
      createdAt: new Date(),
    });
  }
});
