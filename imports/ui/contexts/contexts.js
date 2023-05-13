import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
import { PrimaryContexts } from '../../api/primary-contexts/collections.js';

import { exportCollection } from '../../api/helpers.js';

import './addPrimaryContext';
import './contexts.html';

Template.contexts.onCreated(function () {
  this.autorun(() => {
    this.subscribe('primary_contexts', Session.get('contextId'), undefined);
  });
});

Template.contexts.onRendered(() => {
  const el = document.getElementById('contexts');
  const sortable = Sortable.create(el, {
    onEnd (event) {
      const sortedIds = sortable.toArray();

      sortedIds.forEach((id, index) => {
        Meteor.call('updateContext', id, { priority: index });
      });
    },
  });
});

Template.contexts.helpers({
  contexts() {
    return PrimaryContexts.find({ contextId: Session.get('contextId') }, { sort: { priority: 1 } });
  },
});

Template.context.helpers({
  contextClass() {
    return '';
  },
  date() {
    return this.createdAt.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
});

Template.context.events({
  'click .js-delete-context'(event, instance) {
    event.preventDefault();
    Meteor.call('deleteContext', this._id);
  },

  'keydown span[contenteditable]' (event, template) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  },

  'blur span[contenteditable]' (event, template) {
    const newText = event.currentTarget.textContent.trim();
    if (newText !== '') Meteor.call('editContextText', this._id, newText);
    else event.currentTarget.textContent = this.text;
  },

});
