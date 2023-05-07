Template.registerHelper('Session', (key) => {console.log(key);console.log(Session.get(key)); return Session.get(key)});
Template.registerHelper('json2string', (json) => JSON.stringify(json, null, 2));
Template.registerHelper('formatDate', (date) => {
  if (date) return date.toLocaleString();
  else return '';
});
Template.registerHelper('stringify', (obj) => JSON.stringify(obj, null, 2));