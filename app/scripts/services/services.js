'use strict';
angular.module('sbAdminApp').factory('dataService', dataService);

dataService.$inject = ['$rootScope', '$http', '$q', '$filter', '$timeout'];

function dataService($rootScope, $http, $q, $filter, $timeout) {

    activate();

    return {
        languageStrings : languageStrings,
        serverSend : serverSend,
        cookieInit : cookieInit
    };

    function activate() {

    }
    //___host is defined in mysettings.js, included in index.html
    function languageStrings() {
        //this retreives all language strings and saves them as variables
        var currentLanguage = "English";
        return serverSend("get_i18l", {language:currentLanguage});
    }
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
        var milli = Date.now();
        var md5_sum = md5(milli.toString());
        var current = localStorage.pma || 0;
        if (current == 0) {
            localStorage.pma = md5_sum;
            localStorage.cookieMd5 = md5_sum;
        }
        return serverSend('SetCookie', {milli:milli, md5:md5_sum, current:current}); //gives id
        //on the .then, set the following:
        // localStorage.userId
        // localStorage.cookieSet
    }

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


