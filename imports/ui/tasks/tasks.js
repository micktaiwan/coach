import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tasks } from '../../api/tasks/collections';

import './tasks.html';

Template.tasks.onCreated(function() {
  this.autorun(() => {
    this.subscribe('tasks', Session.get('contextId'));
  });
  this.searchQuery = new ReactiveVar('');
});

Template.tasks.onRendered(() => {
  const el = document.getElementById('tasks');
  const sortable = Sortable.create(el, {
    onEnd() {
      const sortedIds = sortable.toArray();

      sortedIds.forEach((id, index) => {
        Meteor.call('updateTask', id, { priority: index });
      });
    },
  });
});

Template.tasks.helpers({
  tasks() {
    const instance = Template.instance();
    const searchQuery = instance.searchQuery.get();

    const commmon = { contextId: Session.get('contextId') };
    const query = searchQuery ? { text: { $regex: searchQuery, $options: 'i' }, ...commmon } : commmon;

    return Tasks.find(query, { sort: { status: -1, priority: 1 } });
  },
});

Template.tasks.events({
  'click .js-add-task'(event, instance) {
    event.preventDefault();
    const form = instance.find('#task-form');
    const inputs = form.querySelectorAll('input, textarea');
    const task = {};

    inputs.forEach(input => {
      task[input.name] = input.value;
    });

    if (task.text === '') return;

    Meteor.call('addTask', task, Session.get('contextId'), (err, res) => {
      if (err) {
        alert(err);
      } else {
        form.reset();
        inputs[0].focus();
      }
    });
  },

  'input #search-input'(event, instance) {
    const searchQuery = event.target.value.trim();
    instance.searchQuery.set(searchQuery);
  },
});

Template.task.helpers({
  taskClass() {
    if (this.status === 'done') return 'done';
    else if (this.status === 'inprogress') return 'inprogress';
    else if (this.generated) return 'generated';
    else return '';
  },
  date() {
    return this.createdAt.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  },
});

Template.task.events({
  'click .js-delete-task'(event, instance) {
    event.preventDefault();
    Meteor.call('deleteTask', this._id);
  },

  'click .js-done'(event, instance) {
    event.preventDefault();
    Meteor.call('updateTask', this._id, { status: 'done', doneAt: new Date() });
  },

  'click .js-inprogress'(event, instance) {
    event.preventDefault();
    Meteor.call('updateTask', this._id, { status: 'inprogress', startedAt: new Date() });
  },

  'keydown span[contenteditable]'(event, template) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  },

  'blur span[contenteditable]'(event, template) {
    const newText = event.currentTarget.innerText.trim();
    if (newText !== '') Meteor.call('editTaskText', this._id, newText);
    else event.currentTarget.innerHTML = this.text;
  },

  'click .js-plan'(event, instance) {
    event.preventDefault();
    const prompt = `Suggest a step by step plan for this task. Reply in HTML format. Task:"${this.text}"`;
    Meteor.call('openaiGenerateText', Session.get('contextId'), '', prompt, (err, res) => {
      if (err) {
        console.log(err);
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
      } else Meteor.call('addTask', { text: res.response, priority: this.priority, generated: true }, Session.get('contextId'));
    });
  },

  'click .js-translate-task'(event, instance) {
    event.preventDefault();
    const task = this;
    const system = 'Act as a professional english translator.\n';
    const prompt = ` Translate in english, close to the original text. If something is not clear, leave it as it is. Do not output quotes in your answer. Do not comment your translation, just output the translation alone. Text to translate: ${task.text}`;
    Meteor.call('openaiGenerateText', Session.get('contextId'), system, prompt, (err, res) => {
      if (err) {
        console.log(err);
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
      } else Meteor.call('editTaskText', task._id, res.response);
    });
  },

});
