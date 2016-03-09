'use strict';
angular.module('sbAdminApp')
    .controller('GroupsCtrl', ['$scope', '$timeout', '$http', 'dataService', '$state', function($scope, $timeout, $http, dataService, $state) {
        var groups = this;
        groups.codeNameChanged = codeNameChanged;
        groups.codeChanged = codeChanged;
        groups.aresaved = false;
        LoadData();
        // groups.code groups.name
        function codeNameChanged() {//creats and updates name for code
            dataService.addEditDigitCodeName(groups.code, groups.name, groups.data).then(function(response) {
                var data = response.data;
                //console.log(data);
                groups.returndata1 = data;
                LoadData();
                // return;
            });
        }
        function codeChanged() { //sends code and returns name if exists
            dataService.addDigitCode(groups.code).then(function(response) {
                var data = response.data;
                groups.name=data.name;
                groups.data=data.data;
                // console.log(data);
                groups.returndata = data;
                LoadData();
                // return;
            });
        }
        function LoadData() { //sends code and returns name if exists
            dataService.loadDigitCodes().then(function(response) {
                var data = response.data;
                groups.saved = [];
                for (var i=0; i<data.length; i++) {
                    var a = {"text":""};
                    a.text = data[i];
                    groups.saved.push(a);
                }
                groups.aresaved = true;
                // if (data) console.log(data);
                // return;
            });
        }

    }]);
