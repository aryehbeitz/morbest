'use strict';
angular.module('sbAdminApp')
    .controller('SavedWorksCtrl', ['$scope', '$timeout', '$http', 'dataService', function($scope, $timeout, $http, dataService) {
        var savedworks = this;
        savedworks.fields = {};
        savedworks.loaded = false;
        savedworks.itemsByPage = 5;
        savedworks.rowClick = rowClick;
        function rowClick(theRow) {
        	console.log(theRow);
        }
        dataService.getAllSavedWorks()
            .then(function(response) {
                //handle the success condition here
                var data = response.data;
                //console.log(data);
                var newData = [];
                //savedworks.fields = data[1];
                var dta = data[0];
                var keys = Object.keys(dta);
                savedworks.rowCollection = [];
                for (var i = 0; i < keys.length; i++) {
                    var a = dta[keys[i]];
                    var keys1 = Object.keys(a);
                    var b = {};
                    for (var j = 0; j < keys1.length; j++) {
                    	//console.log(a[keys1[j]]);
                    	try {
                    	    b[keys1[j]] = decodeURIComponent(a[keys1[j]]);
                    	}
                    	catch(err) {
                    	    b[keys1[j]] = "";
                    	}
                        
                    	//console.log(b[keys1[j]]);
                    }
                    savedworks.rowCollection.push(b);
                }
                //savedworks.rowCollection = newData;
                savedworks.headerRows = data[1];
                savedworks.loaded = true;
                //console.log("tabledata:",JSON.stringify(newData));
                //console.log("headerrows:",JSON.stringify(savedworks.headerRows));
            });

        //console.log(allTlvStocks);

    }]);