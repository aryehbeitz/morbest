'use strict';
angular.module('sbAdminApp')
    .controller('RunSettingsCtrl', ['$scope', '$timeout', '$http', 'dataService', function($scope, $timeout, $http, dataService) {
        var runsettings = this;

        runsettings.update = update;

        runsettings.ready = false;
        dataService.getSettings().then(function(response) {
            //console.log(response);
            runsettings.settings = response.data;
            //console.log(runsettings.settings);
            runsettings.ready = true;
        });

        function update() {
            var results;
            setTimeout(function() {
                results = dataService.setSettings (
                    runsettings.settings.min_range, 
                    runsettings.settings.max_range, 
                    runsettings.settings.num_days, 
                    runsettings.settings.days_back,
                    runsettings.settings.sort_by_field,
                    runsettings.settings.space_two_bests,
                    runsettings.settings.space_buy_sell,
                    runsettings.settings.alut_iska_il, //alut iska il
                    runsettings.settings.alut_iska_us //alut iska us
                );
            },1000);
        }

        // runsettings.stocksready = false;
        // runsettings.run = run;
        // runsettings.selectedsymbol = "";
        // dataService.getAllStockNames().then(function(response) {
        //     runsettings.stocks = response.data;
        //     var keys = Object.keys(runsettings.stocks);
        //     var newdata = [];
        //     for (var i=0; i<keys.length; i++) {
        //         try {
        //             newdata.push(keys[i] + " " + decodeURIComponent(runsettings.stocks[keys[i]]));
        //         }
        //         catch(err) {

        //         }
        //     }
        //     runsettings.stocks = newdata;
        //     //console.log(runsettings.stocks);
        //     // console.log(runsettings.stocks);
        //     runsettings.stocksready = true;
        // });
        // var results;
        // $scope.$watch('runsettings.selectedsymbol', function(){
        //     setTimeout(function(){
        //         results = dataService.getSearchStockNames(runsettings.selectedsymbol);
        //         console.log(runsettings.selectedsymbol);
        //         console.log(results);
        //     },1000);
            
        //   });
        // function dodata() {
        //     //console.log();
        // }
        // function run(symbol){
        //     console.log(symbol);
        //     return;
        //     runsettings.ready = false;
        //     symbol = symbol.split(" ");
        //     console.log(symbol);
        //     dataService.getStockJson(symbol, 250, 0, 2, 100).then(function(response) {
        //         runsettings.data = response.data; 
        //         runsettings.ready = true;
        //     });
        // }        
    }]);
