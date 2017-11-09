(function (angular) {

'use strict';

var twDemoApp = angular.module('twDemoClient', [
  'twDemoConfig'
]);

twDemoApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
});

twDemoApp.controller('MainController', function MainController($scope, $http, APP_CONSTANTS) {
  this.transformRequest = function (obj) {
      var str = [];
      for (var p in obj) {
        if (typeof obj[p] === 'object') {
          for (var pi in obj[p]) {
            str.push(encodeURIComponent(p + "[" + pi) + "]=" + encodeURIComponent(obj[p][pi]));
          }
        } else {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
      return str.join("&");
    };
  $http.defaults.transformRequest = this.transformRequest;

  var getAvailableMerchants = function () {
      var env = $scope.environment;;

      if(!isValidEnvironment(env)){
        console.log('Error: invalid environment ' + env);
        return;
      }

      var base_url = (APP_CONSTANTS.ENVIRONMENTS[env]).URL;
      var merchant_url = base_url + 'merchants?limit=1000';
      var login_url = base_url + 'login';
      var login_username = (APP_CONSTANTS.ENVIRONMENTS[env]).EMAIL;
      var login_password = (APP_CONSTANTS.ENVIRONMENTS[env]).PASSWORD;

      $http.post(login_url,
        {"email": login_username, "password": login_password}
      ).then(function(response) {
        if (!!response.data.token) {
          $http.get(merchant_url, {
            headers: {'Authorization': 'Bearer '+response.data.token}
          })
          .then(function(merchantsResponse){ //resolve promise
            $scope.merchants = merchantsResponse.data.items;
            $scope.totalNumber = parseInt(merchantsResponse.data.total);
            console.log('merchants total: ' + $scope.totalNumber);
          }, function(reason){ //reject promise
            var msg = 'unknown';
            if (reason.data.hasOwnProperty('code') && reason.data.hasOwnProperty('message')) {
              msg = reason.data.code + " " + reason.data.message;
            } else {
              msg = JSON.stringify(reason.data);
            }
            $scope.error = true;
            $scope.errorMessage = msg;
            console.log(1, msg);
          });
        } //if response has token
        else {
          $scope.error = true;
          $scope.errorMessage = response;
          console.log(2, response);
        }
      }, function(error) {
        $scope.error = true;
        $scope.errorMessage = error;
        console.log(3, error);
      });
  }; //function getAvailableMerchants

  var isValidEnvironment  = function (env) {
    return Object.keys(APP_CONSTANTS.ENVIRONMENTS).filter(e => e == env).length > 0;
    //return Object.values(APP_CONSTANTS.ENVIRONMENTS).filter(e => e.URL == env).length > 0;
  }

  $scope.selectEnvironment = function() {
    $scope.error = false;
    $scope.errorMessage = '';
    getAvailableMerchants();
  }

  $scope.merchants = [];
  $scope.environment = '';
  $scope.totalNumber = 0;
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $scope.availableEnvironments = APP_CONSTANTS.ENVIRONMENTS;
  $scope.error = false;
  $scope.errorMessage = '';
});
})(angular);
