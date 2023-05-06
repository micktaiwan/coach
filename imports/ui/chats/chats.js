import './chats.html'

import { Chats } from '../../api/chats/collections.js';

Template.chats.onCreated(function() {
  this.subscribe('chats');
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

    Meteor.call('addChat', 'user', message, (err, res) => {
      if (err) Meteor.call('addChat', 'meta', err.message);
      else {
        Meteor.call('openaiGenerateText', '', message, (err, res) => {
          if(err) Meteor.call('addChat', 'meta', err.message);
          else  Meteor.call('addChat', 'assistant', res);
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
