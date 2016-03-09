//for xeditable: parts based on http://jsfiddle.net/NfPcH/93/
//filter by object http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview
//this is THE link:
// https://vitalets.github.io/angular-xeditable
'use strict';
angular.module('sbAdminApp')
.controller('BlankPageCtrl', ['$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', '$animate', '$cookies','$cookieStore', function($filter, $scope, $timeout, $http, dataService, $state, $stateParams, $animate, $cookies, $cookieStore) {
    var q = this;
    var someSessionObj = { 'innerObj' : 'somesessioncookievalue'};

    $cookies.dotobject = someSessionObj;
    $scope.usingCookies = { 'cookies.dotobject' : $cookies.dotobject, "cookieStore.get" : $cookieStore.get('dotobject') };

    $cookieStore.put('obj', someSessionObj);
    $scope.usingCookieStore = { "cookieStore.get" : $cookieStore.get('obj'), 'cookies.dotobject' : $cookies.obj, };
}]);
