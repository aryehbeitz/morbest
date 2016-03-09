'use strict';
angular.module('sbAdminApp').factory('dataService', dataService);

dataService.$inject = ['$rootScope', '$http', '$q', '$filter', '$timeout', '$cookies'];

function dataService($rootScope, $http, $q, $filter, $timeout, $cookies) {

    activate();

    return {
        serverSend : serverSend,
        cookieInit : cookieInit
    };

    function activate() {

    }
    //___host is defined in mysettings.js, included in index.html
    function serverSend(rq_url, data) {
        var _url = 'http://' + ___host + '/php/server_morbest_json.php';
        var _params = {
            'rq_url': rq_url,
           "data": data
        };
        var _headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        return $http.post(_url, _params, _headers);
    }
    
    //creates 3 variables:
    // $rootScope.cookieMd5
    // $rootScope.cookieSet
    // $rootScope.userId
    
    function cookieInit() {
        if (typeof $rootScope.cookieSet === 'undefined' || $rootScope.cookieSet == false) {//first time
            $rootScope.cookieSet = false;
            $rootScope.cookieMd5 = "";
            $rootScope.userId = -1;

            if (typeof $cookies.pma === 'undefined') { // no cookies set yet
                //no cookie exists, so create
                var milli = Date.now();
                var ourcookie = milli;
                var md5 = "";
                serverSend('SetCookie', {"milli":milli}) //sends milliseconds, retuns md5, sets cookie to md5
                .then(function(response) {
                    md5 = response.data;
                    if (md5.length == 32) {//md5
                        $cookies.pma = md5; //sets cookie
                        serverSend('GetCookie', {"md5":md5}) //send md5, receives id
                        .then(function(response) {
                            $rootScope.cookieMd5 = md5;
                            $rootScope.userId = response.data;
                            $rootScope.cookieSet = true;
                        });
                    }
                });    
            }
            else { //cookie set, retrieve
                $rootScope.cookieMd5 = $cookies.pma;
                serverSend('GetCookie', {"md5":$rootScope.cookieMd5}) //send md5, receives id
                .then(function(response) {
                    $rootScope.userId = response.data;
                    console.log("user " + $rootScope.userId + " retrieved");
                    $rootScope.cookieSet = true;
                });
            }
        }
    }
    






    //this would be the service to call your server, a standard bridge between your model an $http

    // the database (normally on your server)
    var randomsItems = [];

    function createRandomItem(id) {
        var heroes = ['Batman', 'Superman', 'Robin', 'Thor', 'Hulk', 'Niki Larson', 'Stark', 'Bob Leponge'];
        return {
            id: id,
            name: heroes[Math.floor(Math.random() * 7)],
            age: Math.floor(Math.random() * 1000),
            saved: Math.floor(Math.random() * 10000)
        };

    }

    for (var i = 0; i < 1000; i++) {
        randomsItems.push(createRandomItem(i));
    }


    //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
    //in our case, it actually performs the logic which would happened in the server
    function getPage(start, number, params) {

        var deferred = $q.defer();

        var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

        if (params.sort.predicate) {
            filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
        }

        var result = filtered.slice(start, start + number);

        $timeout(function() {
            //note, the server passes the information about the data set size
            deferred.resolve({
                data: result,
                numberOfPages: Math.ceil(filtered.length / number)
            });
        }, 1500);


        return deferred.promise;
    }



}

//not in use yet
angular.module('sbAdminApp').factory('hideSidebar', dataService);

hideSidebar.$inject = ['$http', '$q', '$filter', '$timeout'];

function hideSidebar($http, $q, $filter, $timeout) {

    activate();
    var showNav;
    return {
        hideNav: hideNav,
        showNav: showNav,
        navHideStatus : navHideStatus
    };

    function activate() {
        showNav = true;
    }
    function toggleNav() {
        showNav = !showNav;
    }
    function navHideStatus() {
        return showNav;
    }

}


