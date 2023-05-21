import { WebApp } from 'meteor/webapp';

// WebApp.connectHandlers.use(Meteor.bindEnvironment((req, res, next) => { console.log('transferred'); return next(); }));

WebApp.connectHandlers.use('/slack', (req, res, next) => {
  if (req.method === 'GET') {
    console.log('GET request received!');
    res.writeHead(200);
    res.end('Hello, server route!');
  } else if (req.method === 'POST') {
    console.log('POST request received!', JSON.stringify(req.headers));
    let body = '';
    req.on('data', data => {
      body += data;
    });

    req.on('end', Meteor.bindEnvironment(() => {
      res.writeHead(200);
      const postData = JSON.parse(body);
      if (postData.challenge) { res.end(postData.challenge); return; }
      res.end('ok');

      // console.log('postData:', postData);
      if (postData.event.subtype !== 'bot_message') Meteor.call('processSlackMessage', postData);
      else console.log('bot message received');
    }));
  } else {
    // Pass the request to the next middleware
    next();
  }
});
