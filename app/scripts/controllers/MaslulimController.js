//for xeditable: parts based on http://jsfiddle.net/NfPcH/93/
//filter by object http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview
//this is THE link:
// https://vitalets.github.io/angular-xeditable


//some variables
// maslulim.client_rank
//maslulim.selectedMaslul when click
//localStorage.userId is cookieid
'use strict';
angular.module('sbAdminApp')
    .controller('MaslulimCtrl', ['$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', function($filter, $scope, $timeout, $http, dataService, $state, $stateParams) {
        var maslulim = this;
        dataService.languageStrings("English").then(function(response){
            var fault = parseInt(response.data);
            if (fault == 0) {
                //we failed to load
            }else {
                localStorage.pma_i18l = JSON.stringify(response.data); //already json encoded
            }
            maslulim.language = JSON.parse(localStorage.pma_i18l);
        });
        maslulim.data_ready = true;
        maslulim.rank = 2.5;
        maslulim.originalRank = 0;
        maslulim.Thenext = Thenext;
        maslulim.maslulimData = {};
        maslulim.selectedMaslul = localStorage.selectedMaslul || "";
        maslulim.selectedMaslulName = localStorage.selectedMaslulName || "";
        maslulim.updatedRank = localStorage.updatedRank;
        //creates 3 variables:
        // localStorage.cookieMd5
        // localStorage.cookieSet
        // localStorage.userId
        // dataService.cookieInit();
        function originalRankText() {
            // debugger;
            for (var i=0; i<Object.keys(maslulim.maslulimData).length; i++) {
                var key = Object.keys(maslulim.maslulimData)[i];
                var value = maslulim.maslulimData[key];
                if (value.client_risk_from <= maslulim.rank && value.client_risk_to >= maslulim.rank) {
                    maslulim.originalClientriskName = value.client_risk_name;
                }
            }
            
        }
        //this function is run when user clicks to select a maslul
        maslulim.updateMaslul = function(maslulArr) {
            console.log(maslulArr);
            var riskName = maslulArr.client_risk_name;
            var selectedMaslul = maslulArr.maslul_number;
            var query = "UPDATE `cookies` SET `selected_maslul` = '" + selectedMaslul + "', `selected_maslul_name`='" + riskName + "' WHERE `CookieID`='" + localStorage.userId + "'";
            console.log("tring to update riskname and selected maslul to " + riskName + " " + selectedMaslul + " query: " + query);
            dataService.serverSend('testingservice',{"query":query});
            maslulim.selectedMaslul = selectedMaslul;
            maslulim.selectedMaslulName = riskName;
            localStorage.selectedMaslul = selectedMaslul;
            localStorage.selectedMaslulName = riskName;
            localStorage.selectedMaslulData = JSON.stringify(maslulArr);

        }
        maslulim.showClientRiskName = function(riskname) {
            if (maslulim.originalClientriskName === undefined) {
                maslulim.originalClientriskName = riskname;
            }
            return riskname;
        }
        maslulim.reset = function() {
            delete maslulim.updatedRank;
            delete localStorage.updatedRank;
            maslulim.rank = maslulim.originalRank;
            //reset the speedometer
            updateChart();
        }
        function updateChart(){
            //load chart
            var chart = $('#container').highcharts();
            //update
            var point = chart.series[0].points[0];
            //update
            point.update(maslulim.rank);
        }
        //when clicking to change rank, we update it
        maslulim.updateRank = function(newRank) {
            var query = "UPDATE `cookies` SET `updated_rank` = '" + newRank + "' WHERE `CookieID`='" + localStorage.userId + "'";
            console.log("tring to update rank to " + newRank + " query: " + query);
            dataService.serverSend('testingservice',{"query":query});
            maslulim.updatedRank = newRank;
            localStorage.updatedRank = newRank;
        }
        function Thenext() {
            maslulim.rank = parseFloat(maslulim.rank);
            maslulim.rank = maslulim.rank.mround(maslulim.rank, 0.25);
            if (maslulim.rank < 10 ) {
                maslulim.rank += 0.25;
            }
            maslulim.rank = maslulim.rank.round(2);
            //update the speedometer
            updateChart();
            //update db with new rank
            maslulim.updateRank(maslulim.rank);
        }        
        maslulim.Theprev = Theprev;
        function Theprev () {
            maslulim.rank = parseFloat(maslulim.rank);
            maslulim.rank = maslulim.rank.mround(maslulim.rank, 0.25);
            if (maslulim.rank > 0 ) {
                maslulim.rank -= 0.25;
            }
            maslulim.rank = maslulim.rank.round(2);
            // maslulim.rank = mypad(maslulim.rank, 5, '0');
            //update the speedometer
            updateChart();
            //update db with new rank
            maslulim.updateRank(maslulim.rank);
        }

        maslulim.data_ready = false;
        
        //localStorage.cookieMd5 = localStorage.pma;
        //console.log("we found a cookie: " + localStorage.pma);
         dataService.cookieInit()
            .then(function(response) {
                localStorage.userId = parseInt(response.data);
                localStorage.cookieSet = true;
            // dataService.serverSend('GetCookie', {"md5":localStorage.cookieMd5}) //send md5, receives id
            // .then(function(response) {
                // localStorage.userId = parseInt(response.data);
                // console.log("user " + localStorage.userId + " retrieved");
                // localStorage.cookieSet = true;
                // debugger;
            // if (localStorage.cookieSet) {
                var query = "SELECT `client_rank` FROM `cookies` WHERE `CookieID`='" + localStorage.userId + "'";
                console.log(query);
                dataService.serverSend('testingservice',{"query":query})
                .then(function(response) {
                    console.log(response.data);
                    var data = response.data;
                    try {
                        maslulim.client_rank = data[0][0].client_rank;
                        console.log("we got client rank: " + maslulim.client_rank);
                    }
                    catch(err) {
                        maslulim.client_rank = 0;
                        console.log("we didn't get a client rank");
                    }
                    maslulim.rank = parseFloat(maslulim.client_rank);
                    maslulim.rank = maslulim.rank.round(2);// = parseFloat(maslulim.client_rank);
                    maslulim.originalRank = maslulim.rank;
                    var query = "SELECT `annual_yield` FROM `benchmark_results` WHERE benchmark_number=1";
                    dataService.serverSend('testingservice',{"query":query})
                    .then(function(response) {
                        var data = response.data;
                        maslulim.annual_yield_risk_free = data[0][0].annual_yield;
                        var query = "SELECT `afikim`.`short_description`, `afikim`.`extended_description`, `afikim`.`Maslul_Number`, `afikim`.`Afik_name`, `afikim`.`Afik_Number`, `afikim`.`benchmark_number`, `afikim`.`Holding_Perc`, `afikim`.`Min_Holding_Perc`, `afikim`.`Max_Holding_Per`, `client_risk_levels`.`Up_to_risk`, `client_risk_levels`.`Client_risk_name`, `client_risk_levels`.`risk_from`, `client_risk_levels`.`maslul1`, `client_risk_levels`.`maslul2`, `benchmark_results`.`annual_yield`, `benchmark_results`.`standard_d`, `benchmark_results`.`index_sharp` FROM `afikim` LEFT JOIN `client_risk_levels` ON `afikim`.`Maslul_Number`=`client_risk_levels`.`maslul1` OR `afikim`.`Maslul_Number`=`client_risk_levels`.`maslul2` LEFT JOIN `benchmark_results` ON `benchmark_results`.`benchmark_number`=`afikim`.`benchmark_number` ORDER BY `afikim`.`Maslul_Number` ASC";
                        dataService.serverSend('testingservice',{"query":query})
                        .then(function(response) {
                            var data = response.data;
                            if (response.data == 0) {
                                // console.log("no data");
                            } else {
                                var maslul_tmp=response.data[0];
                                var maslulim_headers=response.data[1];
                                var count = Object.keys(maslul_tmp).length;
                                //process the data
                                var data_holder = [];
                                var j=0;
                                var annual_yield_relative_sum=0, index_sharp_relative_sum=0, standard_d_relative_sum=0;
                                var holding_sum=0;
                                for (var i=0; i<count; i=j) {
                                    var maslul = {
                                        "maslul_number":maslul_tmp[i].Maslul_Number,
                                        "client_risk_from":maslul_tmp[i].risk_from,
                                        "client_risk_to":maslul_tmp[i].Up_to_risk,
                                        "client_risk_name":maslul_tmp[i].Client_risk_name,
                                        "short_description":maslul_tmp[i].short_description,
                                        "extended_description":maslul_tmp[i].extended_description,
                                        "sum_annual_yield":0,
                                        "sum_index_sharp":0,
                                        "sum_standard_d":0,
                                        "sum_holding":0,
                                        "afikim":[]
                                    };
                                    annual_yield_relative_sum=0; index_sharp_relative_sum=0; standard_d_relative_sum=0;
                                    holding_sum = 0;
                                    for (var j=i; j<count && (maslul_tmp[i].Maslul_Number == maslul_tmp[j].Maslul_Number); j++) {
                                        var annual_yield_relative = maslul_tmp[j].Holding_Perc*maslul_tmp[j].annual_yield;
                                        var index_sharp_relative = maslul_tmp[j].Holding_Perc*maslul_tmp[j].index_sharp;
                                        var standard_d_relative = maslul_tmp[j].Holding_Perc*maslul_tmp[j].standard_d;
                                        annual_yield_relative_sum += annual_yield_relative;
                                        index_sharp_relative_sum += index_sharp_relative;
                                        standard_d_relative_sum += standard_d_relative;
                                        holding_sum += Number(maslul_tmp[j].Holding_Perc);
                                        var afik = {
                                            "afik_number":maslul_tmp[j].Afik_Number,
                                            "afik_name":maslul_tmp[j].Afik_name,
                                            "afik_holding_percent":parseFloat(maslul_tmp[j].Holding_Perc*100).round(1) + "%",
                                            "afik_min_holding_percent":parseFloat(maslul_tmp[j].Min_Holding_Perc*100).round(1) + "%",
                                            "afik_max_holding_percent":parseFloat(maslul_tmp[j].Max_Holding_Per*100).round(1) + "%",
                                            "annual_yield":parseFloat(maslul_tmp[j].annual_yield*100).round(1) + "%",
                                            "index_sharp":parseFloat(maslul_tmp[j].index_sharp*100).round(1),
                                            "standard_d":parseFloat(maslul_tmp[j].standard_d*100).round(1) + "%",
                                            "annual_yield_relative":parseFloat(annual_yield_relative*100).round(1) + "%",
                                            "index_sharp_relative":parseFloat(index_sharp_relative*100).round(1),
                                            "standard_d_relative":parseFloat(standard_d_relative*100).round(1) + "%",
                                            "benchmark_number":maslul_tmp[j].benchmark_number,
                                        };
                                        maslul.afikim.push(afik);
                                    }
                                    // if (maslul.afikim.length < 8) {
                                    //     for (var af=maslul.afikim.length; af<7; af++) {
                                    //         var afik = {
                                    //             "afik_number":"",
                                    //             "afik_name":"",
                                    //             "afik_holding_percent":"",
                                    //             "afik_min_holding_percent":"",
                                    //             "afik_max_holding_percent":"",
                                    //             "annual_yield":"",
                                    //             "index_sharp":"",
                                    //             "standard_d":"",
                                    //             "annual_yield_relative":"",
                                    //             "index_sharp_relative":"",
                                    //             "standard_d_relative":"",
                                    //             "benchmark_number":""
                                    //         };
                                    //         maslul.afikim.push(afik);
                                    //     }
                                    // }

                                    
                                    
                                    maslul.sum_annual_yield = parseFloat(annual_yield_relative_sum*100).toFixed(2) + "%";
                                    // maslul.sum_index_sharp = parseFloat(index_sharp_relative_sum*100).toFixed(2);
                                    maslul.sum_index_sharp = parseFloat((annual_yield_relative_sum - maslulim.annual_yield_risk_free)/standard_d_relative_sum).toFixed(2);
                                    maslul.sum_standard_d = parseFloat(standard_d_relative_sum*100).toFixed(2) + "%";
                                    maslul.sum_holding = Math.round(holding_sum*100) + "%";
                                    data_holder.push(maslul);
                                }

                                //sets the original rank text
                                originalRankText();
                                //console.log(response.data);
                                //console.log(JSON.stringify(data_holder));
                                maslulim.maslulimData = data_holder;
                                console.log(data_holder);
                                maslulim.data_ready = true;
                                console.log(maslulim.data_ready);
                                //now that everything is ready, let load the chart
                                maslulim.chart = {
                                    chart: {
                                        type: 'gauge',
                                        plotBackgroundColor: null,
                                        plotBackgroundImage: null,
                                        plotBorderWidth: 0,
                                        plotShadow: false
                                    },

                                    title: {
                                        text: ''//Client Risk Rank
                                    },

                                    pane: {
                                        startAngle: -150,
                                        endAngle: 150,
                                        background: [{
                                            backgroundColor: {
                                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                                stops: [
                                                    [0, '#FFF'],
                                                    [1, '#333']
                                                ]
                                            },
                                            borderWidth: 0,
                                            outerRadius: '109%'
                                        }, {
                                            backgroundColor: {
                                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                                stops: [
                                                    [0, '#333'],
                                                    [1, '#FFF']
                                                ]
                                            },
                                            borderWidth: 1,
                                            outerRadius: '107%'
                                        }, {
                                            // default background
                                        }, {
                                            backgroundColor: '#DDD',
                                            borderWidth: 0,
                                            outerRadius: '105%',
                                            innerRadius: '103%'
                                        }]
                                    },

                                    // the value axis
                                    yAxis: {
                                        min: 0,
                                        max: 10,

                                        minorTickInterval: 'auto',
                                        minorTickWidth: 1,
                                        minorTickLength: 10,
                                        minorTickPosition: 'inside',
                                        minorTickColor: '#666',

                                        tickPixelInterval: 30,
                                        tickWidth: 2,
                                        tickPosition: 'inside',
                                        tickLength: 1,
                                        tickColor: '#666',
                                        labels: {
                                            step: 2,
                                            rotation: 'auto'
                                        },
                                        title: {
                                            text: '' //km/h
                                        },
                                        plotBands: [{
                                            from: 0,
                                            to: 4,
                                            color: '#55BF3B' // green
                                        }, {
                                            from: 4.01,
                                            to: 7,
                                            color: '#DDDF0D' // yellow
                                        }, {
                                            from: 7.01,
                                            to: 10,
                                            color: '#DF5353' // red
                                        }]
                                    },

                                    series: [{
                                        name: 'Risk Level',//Speed
                                        data: [maslulim.rank],
                                        tooltip: {
                                            valueSuffix: ' '//km/h
                                        },
                                        dataLabels: {
                                            formatter: function() {
                                            var number = this.y,
                                                    prec = 2;
                                            while(number > 10) {
                                                number /= 10;
                                                prec--;
                                            }
                                            return this.y.toFixed(prec);
                                          }
                                        }
                                    }]

                                };
                                //end var chart
                                // debugger;
                                    $('#container').highcharts(maslulim.chart, function (chart) {
                                        var point = chart.series[0].points[0];
                                        point.update(maslulim.rank);
                                    } );
                               
                             }
                           });
                        });
                // });
            });
        });
}]);
