'use strict';
angular.module('sbAdminApp')
.controller('GtoLoadingCtrl', ['$scope', '$timeout', '$http', 'dataService', function($scope, $timeout, $http, dataService) {
    var gtoloading = this;
    dataService.getExampleHebrewStockHeaders().then(function(response) {
    	gtoloading.stockheaders = response.data;
        gtoloading.stockheaderdata = response.data[0]
        gtoloading.cdata = response.data[1]
        console.log(response.data);
    })    
    dataService.getGtoDailyCsvHeaders().then(function(response) {
    	gtoloading.tableheaders = response.data;
        console.log(response.data);
    })

}]);
