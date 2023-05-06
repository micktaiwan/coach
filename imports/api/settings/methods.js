Meteor.methods({
  setApiKey(apiKey) {
    check(apiKey, String);

    Meteor.users.update(Meteor.userId(), {
      $set: {
        'openAI.apiKey': apiKey,
      },
    });
  },
});
