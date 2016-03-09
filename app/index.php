
<!doctype html>
<html class="no-js">
  <head>
    <meta charset="utf-8">

    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(.) styles/vendor.css -->
    <!-- bower:css -->
    <!-- <link rel="stylesheet" href="css/bootstrap.min.css" /> -->
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/main.css" />

    <!-- endbower -->
    <!-- endbuild -->
    
    <!-- build:css(.tmp) styles/main.css -->
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/sb-admin-2.css">
    <link rel="stylesheet" href="styles/timeline.css">
    <link rel="stylesheet" href="bower_components/metisMenu/dist/metisMenu.min.css">
    <link rel="stylesheet" href="bower_components/angular-loading-bar/build/loading-bar.min.css">
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" type="text/css">
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.css" />
    <link rel="stylesheet" href="bower_components/datatables/media/css/jquery.dataTables.css" />
    <link rel="stylesheet" href="bower_components/datatables/media/css/dataTables.bootstrap.css" />
    <!-- <link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.css" /> -->
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css" />
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.layouts.css" />
    <link rel="stylesheet" href="bower_components/nvd3/build/nv.d3.css">
    <!-- <link href="bower_components/angular-xeditable/dist/css/xeditable.css" rel="stylesheet"> -->
    <!-- <link rel="stylesheet" media="all" href="bower_components/leonardo/dist/leonardo.min.css" /> -->
    <!-- <link rel="stylesheet" media="all" href="bower_components/json-formatter/dist/json-formatter.css" /> -->
    <!-- <link rel="stylesheet" href="css/ng-table.css"> -->
    <link rel="stylesheet" href="css/autocomplete.css">
    <!-- <link rel="stylesheet" href="css/xeditable.css"> -->
    <link rel="stylesheet" href="css/common.css">
    <link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <!-- <link href="css/embed-min.css" rel="stylesheet" type="text/css" /> -->
    <!-- endbuild -->
    
    <!-- build:js(.) scripts/vendor.js -->
    <!-- bower:js -->
    <script src="bower_components/jquery/dist/jquery.min.js"></script>

    <script src="bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="js/jquery-ui.js"></script>
    <!-- <script src="js/smart-table.debug.js"></script>-->
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/d3/d3.js"></script>
    <script src="bower_components/nvd3/build/nv.d3.js"></script> <!-- or use another assembly -->
    <!-- // <script src="js/angular-drag-and-drop-lists.js"></script> -->
    <!-- // <script src="js/angular-dragdrop.min.js"></script> -->
    <!-- // <script src="js/sortable.js"></script> -->
    <!-- // <script src="js/xeditable.js"></script> -->
    <script src="bower_components/angular-nvd3/dist/angular-nvd3.js"></script>
    <!-- // <script src="bower_components/angular-xeditable/dist/js/xeditable.js"></script> -->

    <script src="bower_components/angular-datatables/dist/angular-datatables.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="bower_components/json3/lib/json3.min.js"></script>
    <script src="bower_components/oclazyload/dist/ocLazyLoad.min.js"></script>
    <script src="bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script src="js/ui-bootstrap-tpls-modified.js"></script>
    <script src="bower_components/metisMenu/dist/metisMenu.min.js"></script>
    <script src="bower_components/Chart.js/Chart.min.js"></script>
    <script src="bower_components/angular-mocks/angular-mocks.js"></script>
    <!-- // <script src="bower_components/leonardo/dist/leonardo.js"></script> -->

    <!-- <script src="bower_components/angular-smart-table/dist/smart-table.js"></script>-->
    <script src="js/smart-table-modified.js"></script>

    <script src="js/jquery.ui.touch-punch.min.js"></script>

    <!-- // <script src="js/angular-local-storage.min.js"></script> -->


    <script src="bower_components/angular-aria/angular-aria.js"></script>
    <script src="bower_components/angular-animate/angular-animate.js"></script>
    
    <script src="bower_components/angular-material/angular-material.js"></script>

    <!-- <script src="bower_components/ng-tags-input/ng-tags-input.js"></script>-->

    <!-- // <script src="bower_components/json-formatter/dist/json-formatter.js"></script> -->
    <script src="js/autocomplete.js"></script>
    <!-- <script src="js/ng-table.js"></script> -->

   
    <!-- endbower -->
    <!-- endbuild -->
    
    <!-- build:js({.tmp,app}) scripts/scripts.js -->
        <script src="scripts/app.js"></script>
        <script src="js/sb-admin-2.js"></script>
        <!-- // <script src="js/amChartsDirective.js"></script> -->
        <script src="js/settings/mysettings.js"></script>
        <script src="scripts/services/services.js"></script>
        <script src="scripts/directives/directives.js"></script>
        <script src="scripts/directives/angular.editInPlace.js"></script>
        <script src="scripts/directives/angular.ngEnter.js"></script>
    <!-- endbuild -->




    <!-- Custom CSS -->

    <!-- Custom Fonts -->

    <!-- Morris Charts CSS -->
    <!-- <link href="styles/morrisjs/morris.css" rel="stylesheet"> -->


    </head>
   
    <body>

    <div ng-app="sbAdminApp"> <!-- leo-activator -->

        <div ui-view></div>

    </div>
<?php echo "Hi there!"; ?>
    </body>

</html>