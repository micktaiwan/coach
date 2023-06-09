Template.registerHelper('Session', key => Session.get(key));
Template.registerHelper('json2string', json => JSON.stringify(json, null, 2));
Template.registerHelper('formatDate', date => {
  if (date) return date.toLocaleString();
  else return '';
});
Template.registerHelper('stringify', obj => JSON.stringify(obj, null, 2));
Template.registerHelper('nl2br', str => str.replace(/\n/g, '<br>'));
Template.registerHelper('eq', (a, b) => a === b);
Template.registerHelper('now', () => new Date());
Template.registerHelper('log', args => console.log(args));
