module.exports = {
  swagger: '2.0',
  basePath: '/',
  info: {
    title: 'API Documentation',
    description: '',
    version: '1.0.0',
  },
  tags: [
    {
      name: 'files',
      description: 'File operations',
    },
  ],
  paths: {},
  definitions: {
    File: {
      type: 'object',
      properties: {
        fileId: {
          type: 'string',
        },
        fileName: {
          type: 'string',
        },
      },
    },
    File_download: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
      },
    },
    File_upload: {
      type: 'object',
      properties: {
        fileId: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
    Error_Not_Found: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
      },
    },
  },
};

