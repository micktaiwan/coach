import './settings.html';

Template.settings.events({
  'click .js-set-api-key'(event, instance) {
    event.preventDefault();
    const apiKey = document.querySelector('#api-key').value;
    Meteor.call('setApiKey', apiKey);
  },
});
