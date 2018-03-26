'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

let isProduction = EmberApp.env() === 'production';

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      sourceMap: isProduction,
      includePaths: ['app/styles']
    },
    'esw-cache-fallback': {
      patterns: [
        '/api/v1/(.+)'
      ],
    },
    svg: {
      paths: [
        'public/images'
      ]
    }
  });

  return app.toTree();
};
