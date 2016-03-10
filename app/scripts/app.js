'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */


angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    // 'frapontillo.highcharts',
    // 'canvasGauge',
    // 'ui.bootstrap',
    'angular-loading-bar',
    // 'leonardo',
    'smart-table',
    // 'ngMaterial',
    'ngCookies',
    'ngAria',
    // 'ngAnimate',
    'datatables',
    'ngComboDatePicker',
    'nvd3',
    // 'ngDragDrop',
    // 'ui.sortable',
    // 'LocalStorageModule',
    // 'xeditable',
    'ui.bootstrap',
    // 'ngMockE2E',
    //'ngTagsInput' //autocomplete - http://plnkr.co/edit/E0dnRezHPkscG5lP6mFw?p=preview
     // 'angular-datatables',
    // 'ngTable',
    // 'jsonFormatter'
     'autocomplete'
  ])
  .config(['$httpProvider','$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($httpProvider,$stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    })

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.hebrewStocks',{
        templateUrl:'views/hebrewstocks_template.html',
        controller: 'HebrewStocksCtrl',
        url:'/hebrewStocks',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
               'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/HebrewStocksController.js']
            })
          }
        }
    })
        .state('dashboard.usstocks',{
          templateUrl:'views/usstocks_template.html',
          controller: 'UsStocksCtrl',
          url:'/usStocks',
          resolve: {
            loadMyFile:function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name:'chart.js',
                files:[
                  'bower_components/angular-chart.js/dist/angular-chart.min.js',
                 'bower_components/angular-chart.js/dist/angular-chart.css'
                ]
              }),
              $ocLazyLoad.load({
                  name:'sbAdminApp',
                  files:['scripts/controllers/UsStocksController.js']
              })
            }
          }
      })
          .state('dashboard.runsettings',{
            templateUrl:'views/runsettings_template.html',
            controller: 'RunSettingsCtrl',
            url:'/runSettings',
            resolve: {
              loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name:'chart.js',
                  files:[
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                   'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['scripts/controllers/RunSettingsController.js']
                })
              }
            }
        }) .state('dashboard.nvcharts',{
            templateUrl:'views/nvcharts_template.html',
            controller: 'NvChartsCtrl',
            url:'/nvcharts',
            resolve: {
              loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name:'chart.js',
                  files:[
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                   'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['scripts/controllers/NvChartsController.js']
                })
              }
            }
        }).state('dashboard.gtoloading',{
            templateUrl:'views/gtoloading_template.html',
            controller: 'GtoLoadingCtrl',
            url:'/gtoloading',
            resolve: {
              loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name:'chart.js',
                  files:[
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                   'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['scripts/controllers/GtoLoadingController.js']
                })
              }
            }
        })
            .state('dashboard.getalljson',{
              templateUrl:'views/getalljson_template.html',
              controller: 'GetAllJsonCtrl',
              //theid is sent in a function like this:
              //$state.go('dashboard.getalljson', {"theid": 20});
              //and is retrieved by including '$stateParams' as a dependency in the controller
              //and checking the contents of $stateParams
              //see documentation here: 
              //http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#state
              url:'/getalljson:theid',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'chart.js',
                    files:[
                      'bower_components/angular-chart.js/dist/angular-chart.min.js',
                     'bower_components/angular-chart.js/dist/angular-chart.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/GetAllJsonController.js']
                  })
                }
              }
          }).state('dashboard.groups',{
              templateUrl:'views/groups_template.html',
              url:'/groups',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'chart.js',
                    files:[
                      'bower_components/angular-chart.js/dist/angular-chart.min.js',
                     'bower_components/angular-chart.js/dist/angular-chart.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/GroupsController.js']
                  })
                }
              }}).state('dashboard.testing',{
              templateUrl:'views/testing_template.html',
              url:'/testing',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'TestingCtrl',
                    files:[
                      // 'css/bootstrap3.min.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/TestingController.js']
                  })
                }
              }
          }).state('dashboard.maslulim',{
              templateUrl:'views/maslulim_template.html',
              url:'/maslulim',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'MaslulimCtrl',
                    files:[
                      // 'css/bootstrap3.min.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/MaslulimController.js']
                  })
                }
              }
          }).state('dashboard.questions',{
              templateUrl:'views/questions_template.html',
              url:'/questions',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'QuestionsCtrl',
                    files:[
                      // 'css/bootstrap3.min.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/QuestionsController.js']
                  })
                }
              }
          }).state('dashboard.consolidatedresults',{
              templateUrl:'views/consolidated_results_template.html',
              controller: 'ConsolidatedResultsCtrl',
              url:'/consolidatedresults',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                    name:'chart.js',
                    files:[
                      'bower_components/angular-chart.js/dist/angular-chart.min.js',
                     'bower_components/angular-chart.js/dist/angular-chart.css'
                    ]
                  }),
                  $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/ConsolidatedResultsController.js']
                  })
                }
              }
          })
              .state('dashboard.favorites',{
                templateUrl:'views/favorites_template.html',
                controller: 'FavoritesCtrl',
                url:'/favorites',
                resolve: {
                  loadMyFile:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      name:'chart.js',
                      files:[
                       'bower_components/angular-chart.js/dist/angular-chart.min.js',
                       'bower_components/angular-chart.js/dist/angular-chart.css'
                      ]
                    }),
                    $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:['scripts/controllers/favoritesController.js']
                    })
                  }
                }
            })
              .state('dashboard.actualTrades',{
                templateUrl:'views/actualtrades_template.html',
                controller: 'ActualTradesCtrl',
                url:'/actualtrades',
                resolve: {
                  loadMyFile:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      name:'chart.js',
                      files:[
                        'bower_components/angular-chart.js/dist/angular-chart.min.js',
                       'bower_components/angular-chart.js/dist/angular-chart.css'
                      ]
                    }),
                    $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:['scripts/controllers/ActualTradesController.js']
                    })
                  }
                }
            })
 .state('dashboard.savedWorks',{
            templateUrl:'views/savedworks_template.html',
            controller: 'SavedWorksCtrl',
            url:'/savedWorks',
            resolve: {
              loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name:'blank.js',
                  files:[
                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                   'bower_components/angular-chart.js/dist/angular-chart.css'
                  ]
                }),
                $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['scripts/controllers/SavedWorksController.js']
                })
              }
            }
        })

      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login'
    })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
  }]);