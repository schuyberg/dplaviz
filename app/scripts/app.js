'use strict';

angular
  .module('v2App', [
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

// v2App.config(['$httpProvider', function ($httpProvider) {
//     $httpProvider.defaults.useXDomain = true;
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     }
// ]);

  // v2App.config(function(){

  //      $httpProvider.defaults.useXDomain = true;
  //       $httpProvider.defaults.withCredentials = true;
  //       delete $httpProvider.defaults.headers.common["X-Requested-With"];
  //       $httpProvider.defaults.headers.common["Accept"] = "application/json";
  //       $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  // });


