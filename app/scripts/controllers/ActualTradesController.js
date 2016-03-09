'use strict';
angular.module('sbAdminApp')
    .controller('ActualTradesCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', function($scope, $timeout, $http, dataService, $state) {
        var actualtrades = this;
        actualtrades.loaded = false;
        actualtrades.rowClick = rowClick;
        actualtrades.data = [];
        
        function rowClick(theRow) {
            //console.log(theRow);
        }
        dataService.getActualTrades()
            .then(function(response) {
                //handle the success condition here
                var data = response.data;
                var keys = Object.keys(data);
                var myd = [];
                for (var i=0; i<keys.length; i++) {
                    myd.push(data[keys[i]]);
                }
                // console.log(JSON.stringify(myd));
                actualtrades.data = myd;
                actualtrades.loaded = true;
            });
    }]);
