/* jshint -W097 */
/* global angular, console */
'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
  .directive('stats', function() {
    return {
      templateUrl: 'scripts/directives/dashboard/stats/stats.html',
      restrict: 'E',
      replace: true,
      scope: {
        'model': '=',
        'comments': '@',
        'number': '@',
        'name': '@',
        'colour': '@',
        'details': '@',
        'type': '@',
        'url': '@?'
      },
      compile: function(element, attrs) {
        if (!attrs.url) {
          attrs.url = '#';
        }
      },
    };
  });