(function (angular) {
  angular.module('twDemoConfig', [])
  .constant('APP_CONSTANTS', {
    'ENVIRONMENTS': {
      'LOCAL': {
        'URL':'http://admin.api.torawallet.gr/v1/',
        'LABEL': 'local',
        'EMAIL': 'test@example.com',
        'PASSWORD': 'TORA_123@@@'
      },
      'PREPRODUCTION': {
        'URL': 'https://admin.preprod.torawallet.gr/api/v1/',
        'LABEL': 'preprod',
        'EMAIL': 'test@example.com',
        'PASSWORD': 'TORA_123@@@'
      },
      'SANDBOX': {
        'URL': 'https://admin.sandbox.torawallet.gr/api/v1/',
        'LABEL': 'sandbox',
        'EMAIL': 'test@example.com',
        'PASSWORD': 'TORA_123@@@'
      }
    },
  });
})(angular);
