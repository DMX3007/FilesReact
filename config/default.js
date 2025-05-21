module.exports = {
  'apps': {
    'admin-web': {
      port: 33033,
      auth: {
        hostname: 'localhost:33333',
        applicationName: 'filebump_central',
        schema: 'http',
        systemApiKey: 'testKey',
      },
    },
    'cron': {
      'clear-files-task': {schedule: '0 0 1 * * *'},
    },
    'file-api': {
      port: 3007,
      baseUrl: 'http://localhost:3007',
      uploadDir: '/tmp/uploads',
      keys: [
        'testKey1',
        'testKey2',
      ]},
  },
  'logsMongodb': 'mongodb://localhost:27017/filebumb-logs',
  'settingsMongodb': 'mongodb://localhost:27017/filebump-files',
};

