'use strict';
angular.module('sbAdminApp')
    .controller('HebrewStocksCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', function($scope, $timeout, $http, dataService, $state) {
        var blank = this;
        blank.fields = {};
        blank.loaded = false;
        blank.itemsByPage = 5;
        blank.rowClick = rowClick;
        blank.runItem = runItem;
        function runItem(symbol) {
            dataService.stockRun(symbol).then(function(response) {
                var data = response.data;
                var success = false;
                if (data.indexOf("Success for") >= 0) {
                    //find a way of showing the user it has been done
                    //console.log("success" + symbol);
                }
                else {
                    //console.log("fail" + symbol);
                }
                //console.log(data);
                $state.go('dashboard.getalljson'
                   //  , {
                   //   firstname: "aryeh",
                   //   lastname: "b"
                   // }
                   );

            });
            //console.log(symbol);
        }
        function rowClick(theRow) {
            //this function should do the following:
            //  when no run exists, clicking creates a new run
            //  when a run exists, so on hover, show date of run, and click does a new run
        	//console.log(theRow);
        }
        //var dt1 = dataService.getStockJson("aig", 250, 0, 2, 100);
        //dataService.getAllUsStocks()
        dataService.getAllIsraelStocks()
            .then(function(response) {
                //handle the success condition here
                var data = response.data;
                //console.log(data);
                var newData = [];
                //blank.fields = data[1];
                var dta = data[0];
                var keys = Object.keys(dta);
                blank.rowCollection = [];
                for (var i = 0; i < keys.length; i++) {
                    var a = dta[keys[i]];
                    var keys1 = Object.keys(a);
                    var b = {};
                    for (var j = 0; j < keys1.length; j++) {
                    	//console.log(a[keys1[j]]);
                        if (keys1[j] == 'lastrunjson' && a[keys1[j]] != "") {
                            try {
                                var aa = JSON.parse(decodeURIComponent(a[keys1[j]]));
                                b[keys1[j]] = aa[0].date_of_run;
                            }
                            catch(err) {
                                ;
                            }
                            //var aa = a[keys1[j]];
                            
                        }
                        else 
                        {
                            try {
                                b[keys1[j]] = decodeURIComponent(a[keys1[j]]);
                            }
                            catch(err) {
                                b[keys1[j]] = "";
                            }
                        }
                        
                    	//console.log(b[keys1[j]]);
                    }
                    blank.rowCollection.push(b);
                }
                //blank.rowCollection = newData;
                blank.headerRows = data[1];
                blank.loaded = true;
                //console.log(blank.rowCollection);
                //console.log("tabledata:",JSON.stringify(newData));
                //console.log("headerrows:",JSON.stringify(blank.headerRows));
            });
       //  blank.dtOptions ={};
       //  blank.dtColumns = [
       //         DTColumnBuilder.newColumn('id').withTitle('ID'),
       //         DTColumnBuilder.newColumn('firstName').withTitle('First name'),
       //         DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
       //     ];
       // blank.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
       //     //return $resource('data.json').query().$promise;
       //     return dataService.getAllIsraelStocks();
       // }).withPaginationType('full_numbers');
       //  //console.log(allTlvStocks);

    }]);
//http://datatables.net/development/server-side/php_mysql
//https://legacy.datatables.net/examples/data_sources/server_side.html
//http://coderexample.com/datatable-demo-server-side-in-phpmysql-and-ajax/