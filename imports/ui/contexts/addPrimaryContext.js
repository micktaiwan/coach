import './addPrimaryContext.html';

Template.addPrimaryContext.events({
  'click .js-add-context'(event, instance) {
    event.preventDefault();
    const form = instance.find('#context-form');
    const inputs = form.querySelectorAll('input, textarea');
    const context = {};

    inputs.forEach(input => {
      context[input.name] = input.value;
    });

    if (context.text === '') return;

    context.dynContextId = instance.data.dynContextId;

    Meteor.call('addPrimaryContext', context, Session.get('contextId'), (err, res) => {
      if (err) {
        alert(err);
      } else {
        form.reset();
        inputs[0].focus();
      }
    });
  },

});
