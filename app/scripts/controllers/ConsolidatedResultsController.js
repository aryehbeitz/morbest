'use strict';
angular.module('sbAdminApp')
    .controller('ConsolidatedResultsCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', function($scope, $timeout, $http, dataService, $state) {
        var consolidatedresults = this;
        consolidatedresults.rowClick = rowClick;
        consolidatedresults.loadData = loadData;
        consolidatedresults.view = view;
        consolidatedresults.del = del;
        consolidatedresults.loaded = false;
        consolidatedresults.col_names = [];
        consolidatedresults.realdata = [];
        consolidatedresults.loaded = false;
        
        function del(data) {
            // deleting a getjson row
            //doesn't delete, just hides

            // console.log("del clicked");
            // console.log(data);
            dataService.delJson(data).then(function(response) {
                //handle the success condition here
                // console.log(response.data);
                if (response.data == 'success') {
                    //reload data - only on successful delete
                    consolidatedresults.loadData();
                }
                else console.log("problem deleting id: "+data);
            });
        }
        function view(data) {
            //click function to getalljson page, with view on specific
            // console.log("view clicked");
            // console.log(data);
            $state.go('dashboard.getalljson', {"theid": data});
        }
        function rowClick(theRow) {
            //not in use
            //console.log(theRow);
        }
        consolidatedresults.loadData(); //load data on activation
        //function for refresh
        function loadData() {
            consolidatedresults.loaded = false;
            dataService.getConsolidatedResults()
                .then(function(response) {
                    //handle the success condition here
                    var data = response.data;
                    consolidatedresults.realdata = data[0];
                    consolidatedresults.col_names = data[1];
                    consolidatedresults.loaded = true;
                    // console.log(consolidatedresults.realdata);
                    // console.log(consolidatedresults.col_names);
                });
        }
    }]);
