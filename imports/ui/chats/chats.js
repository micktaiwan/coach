import './chats.html'

import { Chats } from '../../api/chats/collections.js';

Template.chats.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chats', Session.get('contextId'));
  });

});

Template.chats.helpers({
  chats() {
    return Chats.find({}, { sort: { createdAt: 1 } });
  },
});

Template.chats.events({

  'click .js-send-message'(event, instance) {
    event.preventDefault();
    const form = instance.find('#chat-form');
    const message = form.querySelector('input[name="message"]').value;

    Meteor.call('addChat', Session.get('contextId'), 'user', message, (err, res) => {
      if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      else {
        Meteor.call('openaiGenerateText', Session.get('contextId'), '', message, (err, res) => {
          if(err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
          else  Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
        });

        form.reset();
      }
    });
  },
      
  'click .js-delete-chat'(event, instance) {
    event.preventDefault();
    const chatId = this._id;

    Meteor.call('deleteChat', chatId, (err, res) => {
      if (err) alert(err);
    });
  }
});
