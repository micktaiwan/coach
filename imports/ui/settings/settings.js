import { exportCollection } from '../../api/helpers.js';

import './settings.html';

Template.settings.events({
  'click .js-set-api-key'(event) {
    event.preventDefault();
    const apiKey = document.querySelector('#api-key').value;
    Meteor.call('setApiKey', apiKey);
  },

  'click .js-export-tasks'(event) {
    event.preventDefault();
    exportCollection('tasks', { contextId: Session.get('currentContextId') } );
  },

  'click .js-export-contexts'(event) {
    event.preventDefault();
    exportCollection('primary_contexts', { contextId: Session.get('currentContextId') });
  },

  'click .js-import-tasks'(event) {
    event.preventDefault();
    const tasksJSON = document.querySelector('#import-tasks').value;
    Meteor.call('importTasks', tasksJSON);
  },

  'click .js-import-primary-contexts'(event) {
    event.preventDefault();
    const contextsJSON = document.querySelector('#import-primary-contexts').value;
    Meteor.call('importPrimaryContexts', contextsJSON);
  },
});
