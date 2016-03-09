//for xeditable: parts based on http://jsfiddle.net/NfPcH/93/
//filter by object http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview
//this is THE link:
// https://vitalets.github.io/angular-xeditable
'use strict';
angular.module('sbAdminApp')
    .controller('MaslulimCtrl', ['$rootScope', '$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', '$cookies', function($rootScope, $filter, $scope, $timeout, $http, dataService, $state, $stateParams, $cookies) {
        var maslulim = this;
        maslulim.data_ready = true;
        maslulim.rank = 2.5;
        maslulim.Thenext = Thenext;
        maslulim.maslulimData = {};
        maslulim.selectedMaslul = "";
        //creates 3 variables:
        // $rootScope.cookieMd5
        // $rootScope.cookieSet
        // $rootScope.userId
        dataService.cookieInit();

        maslulim.updateMaslul = function() {
            var query = "UPDATE `cookies` SET `selected_plan` = '" + maslulim.selectedMaslul + "' WHERE `CookieID`='" + $rootScope.userId + "'";
            dataService.serverSend('testingservice',{"query":query});
        }

        function Thenext() {
            maslulim.rank = parseFloat(maslulim.rank);
            if (maslulim.rank < 9.50 ) {
                maslulim.rank += 0.25;
            }
            // maslulim.rank.toFixed(2);
            maslulim.rank.round(2);
        }        
        maslulim.Theprev = Theprev;
        function Theprev () {
            maslulim.rank = parseFloat(maslulim.rank);
            if (maslulim.rank > 0.25 ) {
                maslulim.rank -= 0.25;
            }
            // maslulim.rank.toFixed(2);
            maslulim.rank.round(2);
        }

        maslulim.data_ready = false;
        
        $rootScope.cookieMd5 = $cookies.pma;
        dataService.serverSend('GetCookie', {"md5":$rootScope.cookieMd5}) //send md5, receives id
        .then(function(response) {
            $rootScope.userId = response.data;
            console.log("user " + $rootScope.userId + " retrieved");
            $rootScope.cookieSet = true;
        if ($rootScope.cookieSet) {
            var query = "SELECT `client_rank` FROM `cookies` WHERE `CookieID`='" + $rootScope.userId + "'";
            console.log(query);
            dataService.serverSend('testingservice',{"query":query})
            .then(function(response) {
                console.log(response.data);
                var data = response.data;
                maslulim.client_rank = data[0][0].client_rank;
                maslulim.rank = parseFloat(maslulim.client_rank);
                maslulim.rank = maslulim.rank.round(2);// = parseFloat(maslulim.client_rank);
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
                            //console.log(response.data);
                            //console.log(JSON.stringify(data_holder));
                            maslulim.maslulimData = data_holder;
                            console.log(data_holder);
                            maslulim.data_ready = true;
                            console.log(maslulim.data_ready);
                         }
                       });
                    });
            });
        }
    });
        }]);
