import _ from 'underscore';
import { Tasks } from './collections';
import { pinecone } from '../pinecone/pinecone';

Meteor.methods({
  addTask(task, contextId) {
    check(task, {
      text: String,
      createdAt: Match.Optional(Date),
      status: Match.Optional(String),
      priority: Match.Optional(Number),
    });
    check(contextId, String);

    const _id = Tasks.insert({
      userId: this.userId,
      contextId,
      text: task.text.replace(/\r\n|\r|\n/g, '<br>'),
      createdAt: task.createdAt || new Date(),
      status: task.status || 'open',
      priority: task.priority || Tasks.find({ contextId }).count(),
    });

    pinecone.addContext({
      _id,
      contextId,
      text: `Task: ${task.text}`,
      type: 'task',
    });

    return _id;
  },

  deleteTask(taskId) {
    check(taskId, String);
    Tasks.remove(taskId);
  },

  updateTask(taskId, data) {
    check(taskId, String);
    check(data, Object);
    Tasks.update(taskId, { $set: data });
  },

  editTaskText(taskId, text) {
    check(taskId, String);
    check(text, String);
    Tasks.update(taskId, { $set: { text } });
  },

});
