import { Tasks } from '../tasks/collections.js';

Meteor.methods({
  setApiKey(apiKey) {
    check(apiKey, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Meteor.users.update(Meteor.userId(), { $set: { 'openAI.apiKey': apiKey } });
  },

  fetchCollection(collectionName, query) {
    check(collectionName, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Mongo.Collection.get(collectionName)
      .find(query, { projection: { _id: 0, contextId: 0 } })
      .fetch();
  },

  importTasks(tasksJSON) {
    check(tasksJSON, String);

    const tasks = JSON.parse(tasksJSON);
    tasks.forEach((task) => {
      Meteor.call('addTask', task, Session.get('contextId'));
    });
  },

  importPrimaryContexts(contextsJSON) {
    check(contextsJSON, String);

    const contexts = JSON.parse(contextsJSON);
    contexts.forEach((context) => {
      Meteor.call('addPrimaryContext', context, Session.get('contextId'));
    });
  },
});
