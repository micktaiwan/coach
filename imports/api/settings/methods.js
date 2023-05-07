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
      .find(query, { projection: { _id: 0, contextId: 0, userId: 0 } })
      .fetch();
  },

  importTasks(contextId, tasksJSON) {
    check(tasksJSON, String);

    const tasks = JSON.parse(tasksJSON);
    tasks.forEach((task) => {
      task.createdAt = new Date(task.createdAt);
      Meteor.call('addTask', task,contextId);
    });
  },

  importPrimaryContexts(contextId, contextsJSON) {
    check(contextsJSON, String);

    const contexts = JSON.parse(contextsJSON);
    contexts.forEach((context) => {
      context.createdAt = new Date(context.createdAt);
      Meteor.call('addPrimaryContext', context, contextId);
    });
  },
});
