import { Tasks } from './collections.js';
import _ from 'underscore';

Meteor.methods({
  'addTask': function(task) {
    check(task, Object);
    check(task.text, String);

    // Add the task to the Tasks collection
    Tasks.insert({
      userId: this.userId,
      text: task.text,
      createdAt: new Date(),
      status: 'open',
      priority: task.priority || Tasks.find().count(),
      ..._.omit(task, ['text', 'priority'])
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
