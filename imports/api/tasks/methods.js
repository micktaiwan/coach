import { Tasks } from './collections.js';
import _ from 'underscore';

Meteor.methods({
  'addTask': function(task, contextId) {
    check(task, Object);
    check(task.text, String);
    check(contextId, String);

    task.text = task.text.replace(/\r\n|\r|\n/g, '<br>');

    // Add the task to the Tasks collection
    Tasks.insert({
      userId: this.userId,
      contextId: contextId,
      text: task.text,
      createdAt: task.createdAt || new Date(),
      status: task.status || 'open',
      priority: task.priority || Tasks.find({contextId: contextId}).count(),
    });
  },

  'deleteTask': function(taskId) {
    check(taskId, String);
    Tasks.remove(taskId);
  },

  updateTask: function(taskId, data) {
    check(taskId, String);
    check(data, Object);
    Tasks.update(taskId, { $set: data });
  },

  editTaskText: function(taskId, text) {
    check(taskId, String);
    check(text, String);
    Tasks.update(taskId, { $set: { text: text } });
  }

});
