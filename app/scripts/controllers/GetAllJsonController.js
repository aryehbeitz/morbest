'use strict';
angular.module('sbAdminApp')
    .controller('GetAllJsonCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', function($scope, $timeout, $http, dataService, $state, $stateParams) {
        var getalljson = this;
        //for receiving params
        // console.log('$stateParams');
        // console.log(JSON.stringify($stateParams.theid));

        //global variables definition
        getalljson.fields = {};
        getalljson.loaded = false;
        getalljson.itemsByPage = 1;
        getalljson.bursa = "US";

        getalljson.originaldata = {};
        getalljson.pos = 0; //init
        getalljson.test = test;
        getalljson.bests_review = 0;
        getalljson.total_bests = 10;
        getalljson.showactions = false;
        getalljson.showviews = false;
        getalljson.savedbackdayrunsloaded = false;
        getalljson.addaction = "";
        getalljson.gotsavedactions = false;
        getalljson.savedactions = {};

        //global function definitions
        getalljson.theprev = theprev;
        getalljson.rowClick = rowClick;
        getalljson.thenext = thenext;
        getalljson.init = init;
        getalljson.dobuy = dobuy;
        getalljson.dosell = dosell;
        getalljson.savedbackdayruns;
        getalljson.getSavedActions = getSavedActions;
        getalljson.openstockviews = openstockviews;
        getalljson.reloadData = reloadData;
        getalljson.initgraphs = initgraphs;
        getalljson.returnFn = returnFn;
        getalljson.returnFnHistorical = returnFnHistorical;
        getalljson.setPos = setPos;
        getalljson.buysellstyle = buysellstyle;
        getalljson.dolock = dolock;
        getalljson.dounlock = dounlock;
        getalljson.checkpassword = checkpassword;
        getalljson.password=="";
        getalljson.locked = true;
        getalljson.unlocked = false;
        getalljson.showbox = false;
        // getalljson.nvdata = nvdata;
        //getalljson.getSavedBackDayRuns = getSavedBackDayRuns;
        //getalljson.toggle_addactions = toggle_addactions;;

        
        // debugger;
        if ($stateParams.theid != "") {
            //came from another page, load specific id
            //getalljson.pagetoset = $stateParams.theid;
            getalljson.reloadData($stateParams.theid);
            getalljson.specialview = true;
        }
        else {
            getalljson.reloadData(-1);//nornal load
            getalljson.specialview = false;
        }
        function returnFn() {
            $state.go('dashboard.getalljson', {"theid": ""});
        }        
        function returnFnHistorical() {
            $state.go('dashboard.consolidatedresults',{});
        }
        function buysellstyle(buysell) { //for ngstyle
            if (buysell == "buy") {
                return "green";
            }
            if (buysell == "sell") {
                return "red";
            }
        }
        function dolock() {
            getalljson.password="";
            getalljson.locked = true;
            getalljson.showbox = false;
            getalljson.unlocked = false;
        }        
        function dounlock() {
            getalljson.showbox = true;
            angular.element('#pwd').focus();
        }
        function checkpassword() {
            if (getalljson.password=="123") {
                getalljson.password="";
                getalljson.unlocked = true;
                getalljson.showbox = false;
                getalljson.locked = false;

            }
        }
        function initgraphs() {
            // console.log("initing graphs");
            //console.log("pos:"+getalljson.pos+" "+ getalljson.bests_review);
            //for getting current data
            //console.log(getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review])
            var min=0, max=0, first, second;
            first = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].holding_yield;
            second = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].accumulated_yield_neto;
            min = Math.min(first,second)-1;
            max = Math.max(first,second)+1;
            getalljson.graph01data = 
            [{
                key: "Cumulative Return",
                values: [{
                    "label": "hldg",
                    "value": first
                }, {
                    "label": "mdl",
                    "value": second
                }]
            }];
            getalljson.graph01options = {chart: {forceY: [min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.2f')(d); }, duration: 500,
            xAxis: {axisLabel: 'Acc % Neto', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };
            
            first = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].trade_yield_positive*100;
            second = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].trade_yield_negative*100;
            min = Math.min(first,second)-1;
            max = Math.max(first,second)+1;
            getalljson.graph02data = [{
                key: "Cumulative Return",
                values: [{
                    "label": "pos.",
                    "value": first
                }, {
                    "label": "neg.",
                    "value": second
                }]
            }];
            getalljson.graph02options = {chart: {forceY: [min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.2f')(d); }, duration: 500,
            xAxis: {axisLabel: 'Tot. Yield %', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };
            
            first = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].positive_trades;
            second = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].negative_trades;
            min = Math.min(first,second)-1;
            max = Math.max(first,second)+1;
            getalljson.graph03data = [{
                key: "Cumulative Return",
                values: [{
                    "label": "pos.",
                    "value": first
                }, {
                    "label": "neg.",
                    "value": second
                }]
            }];
            getalljson.graph03options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.2f')(d); }, duration: 500,
            xAxis: {axisLabel: 'Num Transactions', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };
            
            first = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].average_positive_trades;
            second = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].average_negative_trades;
            min = Math.min(first,second)-1;
            max = Math.max(first,second)+1;
            getalljson.graph04data = [{
                key: "Cumulative Return",
                values: [{
                    "label": "pos.",
                    "value": first
                }, {
                    "label": "neg.",
                    "value": second
                }]
            }];
            getalljson.graph04options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.2f')(d); }, duration: 500,
            xAxis: {axisLabel: 'Average Trans. %', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };
            
            //prepare graph5
            var tmp = [];
            tmp.push({"label": "hld", "value": getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].holding_yield})
            min=getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].holding_yield;
            max = min;
            for (var i=0; i<getalljson.originaldata[getalljson.pos].bestaccyields.length && i<5; i++) {
                min = Math.min(min,getalljson.originaldata[getalljson.pos].bestaccyields[i]);
                max = Math.max(max,getalljson.originaldata[getalljson.pos].bestaccyields[i]);
                tmp.push({"label": i+1, "value": getalljson.originaldata[getalljson.pos].bestaccyields[i]})
            }
            // getalljson.originaldata[getalljson.pos].bestaccyields 
            getalljson.graph05data = [{
                key: "Cumulative Return", //bestaccyields 
                values: tmp
            }];
            getalljson.graph05options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.0f')(d); }, duration: 500,
            xAxis: {axisLabel: '5 best acc. yields % neto', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };

            //prepare graph6
            tmp = [];
            min=getalljson.originaldata[getalljson.pos].tradeavgsneto[0];
            max=min;
            for (var i=0; i<getalljson.originaldata[getalljson.pos].tradeavgsneto.length && i<5; i++) {
                min=Math.min(min,getalljson.originaldata[getalljson.pos].tradeavgsneto[i]);
                max=Math.max(max,getalljson.originaldata[getalljson.pos].tradeavgsneto[i]);
                tmp.push({"label": i+1, "value": getalljson.originaldata[getalljson.pos].tradeavgsneto[i]})
            }
            getalljson.graph06data = [{
                key: "Cumulative Return", //bestaccyields 
                values: tmp
            }];
            getalljson.graph06options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.1f')(d); }, duration: 500,
            xAxis: {axisLabel: 'avg trade neto %', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };

            //prepare graph7
            min = getalljson.originaldata[getalljson.pos].avgdayspertrade[0];
            max=min;
            tmp = [];
            for (var i=0; i<getalljson.originaldata[getalljson.pos].avgdayspertrade.length && i<5; i++) {
                min=Math.min(min,getalljson.originaldata[getalljson.pos].avgdayspertrade[i]);
                max=Math.max(max,getalljson.originaldata[getalljson.pos].avgdayspertrade[i]);
                tmp.push({"label": i+1, "value": getalljson.originaldata[getalljson.pos].avgdayspertrade[i]})
            }
            getalljson.graph07data = [{
                key: "Cumulative Return", //bestaccyields 
                values: tmp
            }];
            getalljson.graph07options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 35 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.1f')(d); }, duration: 500,
            xAxis: {axisLabel: 'avg days per trade', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };

            //prepeare graph8
            console.log(first)
            console.log(second)
            console.log(third)
            first = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].avg_vol_5d/1000;
            second = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].avg_vol_3m/1000;
            third = getalljson.originaldata[getalljson.pos].json_string[getalljson.bests_review].avg_vol_yr/1000;
            min = first;
            max = first;
            min=Math.min(min,second);
            min=Math.min(min,third);
            max=Math.max(max,second);
            max=Math.max(max,third);
            var third = 
            getalljson.graph08data = 
                [{
                    key: "Cumulative Return",
                    values: [{
                        "label": "5d",
                        "value": first
                    }, {
                        "label": "3m",
                        "value": second
                    }, {
                        "label": "1yr",
                        "value": third
                    }]
                }];
                getalljson.graph08options = {chart: {forceY:[min, max], type: 'discreteBarChart', height: 180, margin : {top: 20, right: 10, bottom: 20, left: 10 }, showYAxis: true, x: function(d){return d.label;}, y: function(d){return d.value;}, showValues: true, valueFormat: function(d){return d3.format(',.0f')(d); }, duration: 500,
                xAxis: {axisLabel: 'Volume th.', axisLabelDistance: -187 }, yAxis: {axisLabel: '', axisLabelDistance: -10 } } };


        }
        function setPos(pos) {
            // console.log("setpos:"+pos);
            getalljson.pos = pos;
        }
        



        function rowClick(theRow) {console.log(theRow); }
        //bests_review is the current one we are viewing
        function test(key1) {return getalljson.bests_review == key1; } 
        function thenext() {
            if (getalljson.bests_review < (getalljson.total_bests-1)) {
                getalljson.bests_review++;
            }
            // getalljson.pagetoset++
            initgraphs();
        }
        function theprev() {
            if (getalljson.bests_review > 0) getalljson.bests_review--;
            initgraphs();
        }
        function init(v) {getalljson.total_bests = v.json_string.length; }
        function dobuy(symbol) {
            dataService.getSavedActions(symbol)
                .then(function(response){
                    getalljson.savedactions = response.data;
                    getalljson.showactions = !getalljson.showactions;
                    getalljson.addaction = "buy";
                });
        }
        function dosell(symbol) {
            dataService.getSavedActions(symbol)
                .then(function(response){
                    getalljson.savedactions = response.data;
                    getalljson.showactions = !getalljson.showactions;
                    getalljson.addaction = "sell";
                });
        }
        function openstockviews(symbol) {
            dataService.getSavedActions(symbol)
                .then(function(response){
                    //console.log(response.data);
                    getalljson.savedactions = response.data;
                    getalljson.showviews = !getalljson.showviews;
                });
        }
        function getSavedActions(symbol) {
            dataService.getSavedActions(symbol)
                .then(function(response){
                    getalljson.savedactions = response.data;
                    getalljson.gotsavedactions = true;
                    //console.log(response.data);
            });
        }
        // function getSavedBackDayRuns(symbol) {
        //     getalljson.savedbackdayrunsloaded = false;
        //     dataService.getSavedBackDayRuns(symbol)
        //         .then(function(response) {
        //             //handle the success condition here
        //             getalljson.savedbackdayruns = response.data;
        //             getalljson.savedbackdaytrans = [];
        //             var tmp1 = {};

        //             //now do calculations:
        //             //first find a buy
        //             var keys = Object.keys(getalljson.savedbackdayruns);
        //             var il = $.isNumeric(getalljson.savedbackdayruns[keys[0]].symbol);
        //             var alut_iska;
        //             if (il === true) {
        //                 alut_iska = 0.998;
        //             }
        //             else {
        //                 alut_iska = 0.997;
        //             }
        //             var i = 0;
        //             var accumulated_yield_neto = 1, yield_neto;
        //             while (i<keys.length) {
        //                 for(; i<keys.length && getalljson.savedbackdayruns[keys[i]].last_action != 'buy'; i++);
        //                 //now i is at position of buy, so save it
        //                 var thebuy = getalljson.savedbackdayruns[keys[i]];
        //                 //now keep going until you find first sell
        //                 for(; i<keys.length && getalljson.savedbackdayruns[keys[i]].last_action != 'sell'; i++);
        //                 tmp1 = {};
        //                 if (i < keys.length) {
        //                     var thesell = getalljson.savedbackdayruns[keys[i]];
        //                     tmp1["virtualsell"] = false;
        //                 }
        //                 else { //i==
        //                     var thesell = getalljson.savedbackdayruns[keys[i-1]];
        //                     tmp1["virtualsell"] = true;
        //                 }
        //                 //now that we found sell, merge into an action
        //                 tmp1["buyrundate"] = thebuy.newest_run_date;
        //                 tmp1["buyrunshaar"] = thebuy.newest_run_shaar;
        //                 tmp1["buydate"] = thebuy.date_last_action;
        //                 tmp1["buyrate"] = thebuy.last_action_shaar;
        //                 tmp1["buy_first_pair"] = thebuy.first_pair;
        //                 tmp1["buy_second_pair"] = thebuy.second_pair;
        //                 tmp1["sellrundate"] = thesell.newest_run_date;
        //                 tmp1["sellrunshaar"] = thesell.newest_run_shaar;
        //                 tmp1["selldate"] = thesell.date_last_action;
        //                 tmp1["sellrate"] = thesell.last_action_shaar;
        //                 tmp1["sell_first_pair"] = thesell.first_pair;
        //                 tmp1["sell_second_pair"] = thesell.second_pair;
        //                 yield_neto = (thesell.last_action_shaar / thebuy.last_action_shaar) * alut_iska;
        //                 accumulated_yield_neto *= yield_neto;
        //                 tmp1["yield_neto"] = ((yield_neto-1)*100).toFixed(2);
        //                 tmp1["accumulated_yield_neto"] = ((accumulated_yield_neto-1)*100).toFixed(2);
        //                 getalljson.savedbackdaytrans.push(tmp1);
        //             }

        //             getalljson.savedbackdayrunsloaded = true;
        //             console.log(getalljson.savedbackdaytrans);
        //         });
        // }
        var tmp;
        var best_acc_yields = [];
        var avg_days_per_trade = [];
        var tradeavgsneto = [];
        //initial load data
        // getalljson.reloadData(-1);

        function reloadData(id) {
            getalljson.loaded = false;
            dataService.getAllJson()
                .then(function(response) {
                    //handle the success condition here
                    var data = response.data;
                    // console.log(data);
                    var newData = [];
                    //getalljson.fields = data[1];
                    var dta = data[0];
                    getalljson.headerRows = data[1];
                    var keys = Object.keys(dta);
                    getalljson.rowCollection = [];
                    keys.sort();
                    for (var i = 0; i < keys.length; i++) { //over results
                        var a = dta[keys[i]];
                        // console.log(a);
                        if (id >=0) {
                            if (a.id !=id) {
                                continue; //if we have an id, only load that one
                            }
                        }
                        var keys1 = Object.keys(a);
                        // console.log(keys1);
                        var b = {};
                        // console.log(a);
                        //going over
                        //["id", "symbol", "name", "run_date", "json_string"]
                        for (var j = 0; j < keys1.length; j++) { //go over fields of this result

                            try {//when hebrew, encode on server using realurlencode and decode here                            
                                b[keys1[j]] = a[keys1[j]];//decodeURIComponent(a[keys1[j]]);
                                if (keys1[j] == 'json_string') {
                                    var str = b[keys1[j]];
                                    //if (j<1) console.log(a[keys1[j]]);
                                    //since the json is a string, so we need to remove the quotes 
                                    // at the beginning and at the end before we parse it to JSON
                                    str.slice(1, -1);
                                    tmp = JSON.parse(str);

                                    for (var k=0; k<tmp.length; k++) {
                                        tmp[k]["parent_pos"] = i; //we give it index of parent, for each of 10 best
                                    }

                                    for (var k=0; k<tmp.length && k<5; k++) {
                                        //first five, get accumulated_yield_neto
                                        var tt = tmp[k].accumulated_yield_neto;
                                        //tt = Math.round(tt);
                                        best_acc_yields.push(tt.toFixed(1));
                                        b["bestaccyields"] = best_acc_yields;
                                    }
                                    //reset for next initeration, since we got to 5 already
                                    if (k>4) {best_acc_yields = [];} 

                                    for (var k=0; k<tmp.length && k<5; k++) {
                                        var holdingdays = tmp[k].accumulated_holding_days;
                                        var num_trades = tmp[k].positive_trades + tmp[k].negative_trades;
                                        if (num_trades > 0) {
                                            var tt = Math.round(holdingdays / num_trades);
                                            avg_days_per_trade.push(tt);
                                            b["avgdayspertrade"] = avg_days_per_trade;
                                        }
                                    }
                                    if (k>4) {avg_days_per_trade = [];} //reset for next initeration

                                    //tradeavgsneto
                                    for (var k=0; k<tmp.length && k<5; k++) {
                                        var num_trades = tmp[k].positive_trades + tmp[k].negative_trades;
                                        if (num_trades > 0) {
                                            // console.log("trying to divide "+tmp[k].accumulated_yield_neto+ " by "+ num_trades);
                                            var tt = (tmp[k].accumulated_yield_neto / num_trades);
                                            // console.log("showing tt of pos "+ k);
                                            // console.log(tt);
                                            tradeavgsneto.push(tt.toFixed(1));
                                            b["tradeavgsneto"] = tradeavgsneto;
                                        }
                                    }
                                    if (k>4) {
                                        tradeavgsneto = [];
                                    } //reset for next initeration
                                    
                                    //copy data
                                    b[keys1[j]] = tmp;
                                }
                            }
                            catch(err) {
                                b[keys1[j]] = "";
                            }
                            if (keys1[j] == 'run_date') {
                                b[keys1[j]] = timeConverter(b[keys1[j]]);
                            }
                            
                        }
                        getalljson.rowCollection.push(b);
                    }
                    //this we did to set order
                    //getalljson.rowCollection.sort(function(a, b){return a.run_date < b.run_date});
                    //the pagination directive changes with rowCollection, so we make a backup
                    getalljson.originaldata = getalljson.rowCollection;
                    //console.log(getalljson.rowCollection);

                    getalljson.loaded = true;
                    initgraphs();
                });
            }
    }]);
