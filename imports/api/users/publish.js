Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {projection: {'openAI.apiKey': 1, 'openAI.model': 1}});
});
