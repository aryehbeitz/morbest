//for xeditable: parts based on http://jsfiddle.net/NfPcH/93/
//filter by object http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview
//this is THE link:
// https://vitalets.github.io/angular-xeditable
'use strict';
angular.module('sbAdminApp')
    .controller('TestingCtrl', ['$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', function($filter, $scope, $timeout, $http, dataService, $state, $stateParams) {

        var testing = this;
        $scope.get_calculations = function(country) {
         dataService.serverSend('calcservice',{"country":country})
         .then(function(response) {
             var data = response.data;
             if (response.data == 0) {console.log("no data");} else {
                console.log(response.data);
             }
           });
        }
        $scope.selection = {"item":""};
        $scope.$watch('selection.item', function() {
        var table_name = $scope.selection.item;
        
        dataService.serverSend('testingservice',{"query":"SELECT * FROM `" + table_name + "` LIMIT 100"})
        .then(function(response) {
            var data = response.data;
            if (response.data == 0) {console.log("no data");} else {
                $scope.selected_table=response.data[0];
                $scope.selected_table_header=response.data[1];
             }
           });
        });
        dataService.serverSend('testingservice',{"query":"show tables"})
        .then(function(response) {
            var data = response.data;
            if (response.data == 0) {console.log("no data");} else {
                $scope.pma_tables=response.data[0];
                $scope.pma_tables_headers=response.data[1];
            }
        });
        dataService.serverSend('testingservice',{"query":"SELECT `user_id`, `users`.`name`, `email`, `countries`.`name` as 'country' FROM `users` LEFT JOIN `countries` ON `users`.`country_id`=`countries`.`country_id`"})
        .then(function(response) {
            var data = response.data;
            if (response.data == 0) {console.log("no data");} else {
                $scope.countries=response.data[0];
                $scope.countries_header=response.data[1];
            }
        });
        dataService.serverSend('testingservice',{"query":"SELECT * FROM `benchmark_summary` ORDER BY `benchmark_number` ASC"})
        .then(function(response) {
            var data = response.data;
            if (response.data == 0) {console.log("no data");} else {
                $scope.benchmark_s=response.data[0];
                $scope.benchmark_s_header=response.data[1];
            }
        });
    }])
    .run(function(editableOptions) {
      editableOptions.theme = 'bs2';
    });