Meteor.methods({
  setApiKey(apiKey) {
    check(apiKey, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Meteor.users.update(Meteor.userId(), { $set: { 'openAI.apiKey': apiKey } });
  },

  setModel(model) {
    check(model, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Meteor.users.update(Meteor.userId(), { $set: { 'openAI.model': model } });
  },

  fetchCollection(collectionName, query) {
    check(collectionName, String);
    check(query, Object);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Mongo.Collection.get(collectionName)
      .find(query, { projection: { _id: 0, contextId: 0, userId: 0 } })
      .fetch();
  },

  importTasks(contextId, tasksJSON) {
    check(contextId, String);
    check(tasksJSON, String);

    try {
      const tasks = JSON.parse(tasksJSON);
      tasks.forEach(task => {
        task.createdAt = new Date(task.createdAt);
        Meteor.call('addTask', task, contextId);
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },

  importPrimaryContexts(contextId, contextsJSON) {
    check(contextId, String);
    check(contextsJSON, String);

    try {
      const contexts = JSON.parse(contextsJSON);
      contexts.forEach(context => {
        context.createdAt = new Date(context.createdAt);
        Meteor.call('addPrimaryContext', context, contextId);
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
});
