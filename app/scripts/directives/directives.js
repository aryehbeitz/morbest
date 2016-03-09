'use strict';

//used in st-table custom pageination
angular.module('sbAdminApp')
    .directive('pageSelect', function() {
      return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        }
      }
    });

angular.module('sbAdminApp').directive('stockActions', [
    function() {
        return {
            restrict : 'E',
            scope : {
                stock : "=",
                stockname : "=",
                savedactions: "=",
                action: '=',
                firstpair: '=',
                secondpair: '=',
                keepopen: '=',
                thejson: '=',
                rundate: '='
            },
            controller : StockActionsController,
            controllerAs : 'stockactions', //instead of vm
            bindToController : true,
            templateUrl : 'views/stockactions_template.html'
        };
    }
]);

StockActionsController.$inject = ['$q', '$scope', 'dataService'];

function StockActionsController($q, $scope, dataService) {
    var stockactions = this;
    stockactions.showtable = true;
    if (stockactions.action == 'buy') stockactions.buy = true; else stockactions.buy = false;
    if (stockactions.action == 'sell') stockactions.sell = true; else stockactions.sell = false;

    stockactions.addstockaction = addstockaction;

    function addstockaction() {
        var inserted_id;
        //dataService.setSavedActions(symbol, symbol_name, action, date, actual_shaar)
        console.log(stockactions.realdate);
        dataService.setSavedActions(
            stockactions.stock, //GOOGL
            stockactions.stockname, //Google Inc.
            stockactions.action, //buy or sell
            timeConvert(stockactions.realdate), // date we selected e.g. 2015-01-01
            stockactions.realshaar, //shaar of action we did. we entered the shaar
            stockactions.firstpair, //of run
            stockactions.secondpair, //of run
            stockactions.thejson, //of run
            stockactions.rundate //from run

        ).then(function(response){
                inserted_id = response.data;
                console.log("got id"+inserted_id);
                if(inserted_id >= 0) {
                    dataService.addFavToGroup(inserted_id, stockactions.stock, stockactions.stockname, (stockactions.action == "buy")?1:2)
                        .then(function(response){
                            console.log(response.data);
                    });
                } else {
                    console.log("could not insert");
                }
        });
        
        //update data
        // stockactions.showtable = false; //set to false to close dialog after add actions
        dataService.getSavedActions(stockactions.stock)
            .then(function(response){
                stockactions.savedactions = response.data;
                //clear fields
                stockactions.realshaar = "";
                stockactions.realdate = "";
                //show table
                // stockactions.showtable = true;
                stockactions.keepopen = false;

        });
    }

    $( "#draggable" ).draggable();
    $( "#draggable" ).css("left",$(window).width() - $( "#draggable" ).width()-10);
    $(window).resize(function() {
      $( "#draggable" ).css("left",$(window).width() - $( "#draggable" ).width()-10);
    });
}






angular.module('sbAdminApp').directive('stockViews', [
    function() {
        return {
            restrict : 'E',
            scope : {
                stock : "=",
                stockname : "=",
                savedactions: "=",
                keepopen: '=',
                showviews: '=',
                firstpair: '=',
                secondpair: '='
            },
            controller : StockViewsController,
            controllerAs : 'stockviews', //instead of vm
            bindToController : true,
            templateUrl : 'views/stockviews_template.html'
        };
    }
]);

StockViewsController.$inject = ['$q', '$scope', 'dataService'];

function StockViewsController($q, $scope, dataService) {
    var stockviews = this;
    stockviews.deleteactualtrade = deleteactualtrade;
    stockviews.close = close;
    activate();
    
    function deleteactualtrade(id) {
        // console.log("got "+id);
        stockviews.showviews = false;
        dataService.delRealAction(id)
            .then(function(response){
                stockviews.showviews = true;
                console.log(response.data);
        });
    }
    function close() {
        // console.log("close");
        stockviews.showviews = false;
    }
    
    function activate() {
        $( "#draggable" ).draggable();
        $( "#draggable" ).css("left",$(window).width() - $( "#draggable" ).width()-10);
        $(window).resize(function() {
          $( "#draggable" ).css("left",$(window).width() - $( "#draggable" ).width()-10);
        });
    }
   
}











angular.module('sbAdminApp').directive('showBarChart', [
    function() {
        return {
            restrict : 'E',
            scope : {
                maintitle: "@",
                firsttitle: "@",
                firstvalue: "=",
                secondtitle: "@",
                secondvalue: "=",
                width: "@",
                height: "@"
            },
            controller : ShowBarChartController,
            controllerAs : 'showbarchart', //instead of vm
            bindToController : true,
            templateUrl : 'views/showbarchart_template.html'
        };
    }
]);

ShowBarChartController.$inject = ['$q', '$scope'];

function ShowBarChartController($q, $scope) {
    var showbarchart = this;

    showbarchart.bar = {
        labels: [showbarchart.firsttitle, showbarchart.secondtitle],
        data: [
           [showbarchart.firstvalue, showbarchart.secondvalue]
        ]
    };
}

//accordion for angular
//http://jsfiddle.net/openube/MTKp7/263/
angular.module('sbAdminApp').
directive("btstAccordion", function () {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        template:
            "<div class='accordion' ng-transclude></div>",
        link: function (scope, element, attrs) {

            // give this element a unique id
            var id = element.attr("id");
            if (!id) {
                id = "btst-acc" + scope.$id;
                element.attr("id", id);
            }

            // set data-parent on accordion-toggle elements
            var arr = element.find(".accordion-toggle");
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("data-parent", "#" + id);
                $(arr[i]).attr("href", "#" + id + "collapse" + i);
            }
            arr = element.find(".accordion-body");
            $(arr[0]).addClass("in"); // expand first pane
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("id", id + "collapse" + i);
            }
        },
        controller: function () {}
    };
}).
directive('btstPane', function () {
    return {
        require: "^btstAccordion",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            title: "@",
            category: "=",
            order: "="
        },
        template:
            "<div class='accordion-group' >" +
            "  <div class='accordion-heading'>" +
            "    <a class='accordion-toggle' data-toggle='collapse'> {{category.name}} - </a>" +
       
            "  </div>" +
            "<div class='accordion-body collapse'>" +
            "  <div class='accordion-inner' ng-transclude></div>" +
            "  </div>" +
            "</div>",
        link: function (scope, element, attrs) {
            scope.$watch("title", function () {
                // NOTE: this requires jQuery (jQLite won't do html)
                var hdr = element.find(".accordion-toggle");
                hdr.html(scope.title);
            });
        }
    };
})

