'use strict';
angular.module('sbAdminApp')
    .controller('UsStocksCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', function($scope, $timeout, $http, dataService, $state) {
        var usstocks = this;
        usstocks.fields = {};
        usstocks.loaded = false;
        usstocks.itemsByPage = 5;
        usstocks.rowClick = rowClick;
        usstocks.addToFav = addToFav;
        usstocks.runItem = runItem;
        usstocks.checkStockSymbol = checkStockSymbol;
        usstocks.lookupsymbol = "";

        //this is to make sure we don't call the function several times
        //see http://stackoverflow.com/questions/22158063/angular-ngchange-variant-when-user-finishes-typing
        var inputChangedPromise;
        usstocks.inputChanged = function(){
            usstocks.loadusmasterlist = false;
            usstocks.newlist = false;
            if(inputChangedPromise){
                $timeout.cancel(inputChangedPromise);
            }
            inputChangedPromise = $timeout(checkStockSymbol,1000);
        }
        usstocks.addnewInputChanged = function(){
            if(inputChangedPromise){
                $timeout.cancel(inputChangedPromise);
            }
            inputChangedPromise = $timeout(updatenew,1000);
        }
        // checkStockSymbol();
        function updatenew() {
            //takes 
            //usstocks.Sname
            //usstocks.lookupsymbol(make uppercase)
            //usstocks.Soldest_date
            //usstocks.Snewest_date
            //and enters them into database
            dataService.addUpdateSymbol(
                usstocks.lookupsymbol,
                usstocks.Sname,
                usstocks.Soldest_date,
                usstocks.Snewest_date
            ).then(function(response) {
                var data = response.data;
                console.log(data);
                // return;
            });
        }
        function addToFav(symbol, name) {
            dataService.addToFav(symbol,name).then(function(response) {
                var data = response.data;
                //console.log(data);
                // return;
            });
        }
        function checkStockSymbol() {
            if (usstocks.lookupsymbol == "") {//no reason to run on nothing

                return;
            }
            //first thing is lookup symbol from usmasterlist
            usstocks.loadusmasterlist = false;
            dataService.getSymbolInfo(encodeURIComponent(usstocks.lookupsymbol)).then(function(response) {
                var data = response.data;
                console.log("looked u symbol");
                console.log(data);
                //console.log(data;)
                usstocks.STableData = data[0];
                usstocks.SHeaderRows = data[1];
                usstocks.loadusmasterlist = true;
                //now check for start and end dates. try to load if not available
                var keys = Object.keys(usstocks.STableData);
                // var todayDate = timeConvert(new Date());
                //if either no return or no date defined
                if (keys[0] == null || usstocks.STableData[keys[0]].oldest_date.length < 10) { //we at least dont have oldest
                 var sy;
                 if (keys[0] == null) {
                    sy = usstocks.lookupsymbol;
                 } else {
                    sy = usstocks.STableData[keys[0]].Ticker;
                    usstocks.newlist = false;
                 }
                 // && usstocks.STableData[keys[0]].newest_date.length < 10) {
                    //no good dates, so load
                    //loads historical data dates
                    dataService.checkStockSymbol(encodeURIComponent(sy)).then(function(response) {
                        var data = response.data;
                        console.log("date lokup");
                        console.log(data);
                        //we got data
                        //check if new or add
                        if (typeof data.oldest_date !== 'undefined' && (keys[0] != null)) {
                            //load dates into table
                            usstocks.STableData[keys[0]].oldest_date = data.oldest_date;
                            usstocks.STableData[keys[0]].newest_date = data.newest_date;
                            usstocks.STableData[keys[0]].update_date = data.update_date;
                        }

                        if (data != "fail") {
                            if (keys[0] == null) {
                                usstocks.loadusmasterlist = false; //dont show exist
                                usstocks.newlist = true;
                                usstocks.Soldest_date = data.oldest_date;
                                usstocks.Snewest_date = data.newest_date;
                                //means new
                            }
                            usstocks.checkresult = "Success!";
                        } else {
                            usstocks.checkresult = "Fail!";
                        }
                        usstocks.finishedcheck = true;
                    });
                }
            });
        }
        function runItem(symbol) {
            //before run, we want to update the stock data
            dataService.updateStockData(symbol).then(function(response) {
                var data = response.data;
            });
            //now actual run
            dataService.stockRun(symbol).then(function(response) {
                var data = response.data;
                var success = false;
                if (data.indexOf("Success for") >= 0) {
                    //find a way of showing the user it has been done
                }
                else {
                    ;
                }
                $state.go('dashboard.getalljson');
            });

        }
        function rowClick(theRow) {
            //console.log(theRow);
        }
        //getAllUsStocks();
        loadSymbolsFromFav();
        function getAllUsStocks() {
            // var counter = 0, success = false;
            // for (var counter = 0,success = false; counter<3 && success != true; counter++) {
                dataService.getAllUsStocks()
                    .then(function(response) {
                        //handle the success condition here
                        var data = response.data;
                        // if (data[0]=="<" && data[1]=="b") {
                        //     console.log("error. need to redo");
                        //     success = false;
                        //     // continue;
                        // }
                        // else {
                        //     success = true;
                        // }
                        var newData = [];
                        var dta = data[0];
                        var keys = Object.keys(dta);
                        usstocks.rowCollection = [];
                        for (var i = 0; i < keys.length; i++) {
                            var a = dta[keys[i]];
                            var keys1 = Object.keys(a);
                            var b = {};
                            for (var j = 0; j < keys1.length; j++) {
                                //console.log(a[keys1[j]]);
                                if (keys1[j] == 'lastrunjson' && a[keys1[j]] != "") {
                                    
                                    try {
                                        var aa = JSON.parse(a[keys1[j]]);
                                        //var aa = a[keys1[j]];
                                        b[keys1[j]] = aa[0].date_of_run;
                                    }
                                    catch(err) {
                                        ;
                                    }
                                }
                                else {
                                    b[keys1[j]] = a[keys1[j]];
                                }
                            }
                            usstocks.rowCollection.push(b);
                            // usstocks.rowCollection.push(dta[keys[i]]);
                        }
                        usstocks.headerRows = data[1];
                        usstocks.loaded = true;
                    });
            // }
        }       
        function loadSymbolsFromFav() {
            dataService.loadSymbolsFromFav()
                .then(function(response) {
                    //handle the success condition here
                    var data = response.data;
                    //console.log(data);
                    var dta = data[0];
                    var keys = Object.keys(dta);
                    usstocks.tabledata = data[0];
                    usstocks.headerRows = data[1];
                    usstocks.loaded = true;
                });
        }       
    }]);
