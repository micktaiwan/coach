Template.registerHelper('Session', (key) => {return Session.get(key)});
Template.registerHelper('json2string', (json) => JSON.stringify(json, null, 2));
Template.registerHelper('formatDate', (date) => {
  if (date) return date.toLocaleString();
  else return '';
});
Template.registerHelper('stringify', (obj) => JSON.stringify(obj, null, 2));
Template.registerHelper('nl2br', (str) => {console.log(str);   return str.replace(/\n/g, '<br>')});
