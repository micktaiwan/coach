module.exports = {
  servers: {
    one: {
      host: '91.134.136.54',
      username: 'root',
      "password": "cmHzgPM2",
    },
  },
  proxy: {
    domains: 'coach.mickaelfm.me',
    ssl: {
      letsEncryptEmail: 'faivrem@gmail.com',
      forceSSL: true,
    },
    shared: {
      httpPort: 80,
    },
    clientUploadLimit: '0',
  },
  app: {
    name: 'coach',
    path: '../',
    servers: {
      one: {},
    },
    buildOptions: {serverOnly: true},
    env: {
      ROOT_URL: 'https://coach.mickaelfm.me',
      MONGO_URL: 'mongodb://localhost/coach',
    },
    docker: {
      image: 'zodern/meteor:0.7.0-root',
      prepareBundle: true,
      stopAppDuringPrepareBundle: false,
    },
    enableUploadProgressBar: true,
  },

  mongo: {
    oplog: true,
    version: '4.0.10',
    servers: {
      one: {},
    },
  },
};
