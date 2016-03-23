'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar',['$location','hideSidebar',function(hideSidebar) {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
        $scope.check = function(x){
          
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };
          
        if (localStorage.showNavbar === undefined) {
          localStorage.showNavbar = 1;
        }
        if (localStorage.showNavbar == 1) {
          unhideNavbar();
        } else {
          hideNavbar();
        }



        //$scope.navHideStatus = hideSidebar.navHideStatus;
        //console.log(hideSidebar.navHideStatus);
      }
    }
  }]);
