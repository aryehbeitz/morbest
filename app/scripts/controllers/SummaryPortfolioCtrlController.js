'use strict';
angular.module('sbAdminApp')
.controller('SummaryPortfolioCtrl', ['$q', '$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', '$animate',  function($q, $filter, $scope, $timeout, $http, dataService, $state, $stateParams, $animate) {
    var sp = this;
    sp.showRegister = false;
    sp.maslulArr = JSON.parse(localStorage.selectedMaslulData);
    sp.selectedMaslul = localStorage.selectedMaslul
    sp.selectedMaslulName = localStorage.selectedMaslulName;
    sp.maslulArr = JSON.parse(localStorage.selectedMaslulData);
    sp.rank = parseFloat(localStorage.updatedRank);
    dataService.languageStrings("English").then(function(response){
        var fault = parseInt(response.data);
        if (fault == 0) {
            //we failed to load
        }else {
            localStorage.pma_i18l = JSON.stringify(response.data); //already json encoded
        }
        sp.language = JSON.parse(localStorage.pma_i18l);
        sp.toWhomVariable = sp.language["Maslul_" + ((sp.maslulArr.maslul_number > 9)?sp.maslulArr.maslul_number:'0'+sp.maslulArr.maslul_number)+ "_To_whom_Description"];
        sp.longDescriptionVariable = sp.language["Maslul_" + ((sp.maslulArr.maslul_number > 9)?sp.maslulArr.maslul_number:'0'+sp.maslulArr.maslul_number)+ "_Long_Description"];
        prepareCharts();
    });
    //now prepare the chart
    function prepareCharts() {
        sp.chart = {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            credits:{enabled: false},
            colors:['#5485BC', '#AA8C30', '#5C9384', '#981A37', '#FCB319','#86A033', '#614931', '#00526F', '#594266', '#cb6828', '#aaaaab', '#a89375'],
            title: {
                text: ''//Client Risk Rank
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                useHTML: true,
                verticalAlign: 'middle',
                labelFormatter: function() {
                    return '<div style="width:200px"><span style="float:left">' + this.name + '</span><span style="float:right">' + this.y + '%</span></div>';
                }
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
                data: [sp.rank],
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
        $('#ourgauge').highcharts(sp.chart, function (chart) {
            var point = chart.series[0].points[0];
            point.update(sp.rank);
        } );

        var pie_data = [];
        var colors = ['#00ff00', '#bfff00', '#ffff00', '#d5d519', '#00ffff', '#0000ff', '#ff0000'];
        //if we have more colors than afikim, so cut colors, so max is always red
        if (sp.maslulArr.afikim.length < colors.length) {
            colors.reverse();
            colors.length = sp.maslulArr.afikim.length;
            colors.reverse();
        }
        for (var i=0; i<sp.maslulArr.afikim.length; i++) {
            pie_data.push({name: sp.maslulArr.afikim[i].afik_name, y: parseFloat(sp.maslulArr.afikim[i].afik_holding_percent)})
        }
        $('#ourpie').highcharts({
            chart:{type:'pie'},
            credits:{enabled: false},
            colors: colors,

            title:{
                floating: true,
                y: +100,
                text: sp.language.Maslul_Pie_Graph_Title,
                style: {
                    color: '#000',
                    fontWeight: 'bold',
                    "fontSize": "2.0em"
                }
            },
             tooltip: {
                pointFormat: '<b>{point.y}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,                 
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                         distance: -30,
                         color: 'black',
                        enabled: true,
                        format: '{point.percentage:.1f} %',
                        style: {
                            color:  'black',//(Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                            textShadow: false 
                        }

                        // enabled: false                       
                    }                                   
                }
            },
            legend: {
                itemStyle: {
                 fontSize:'20px',
                 font: '11pt Trebuchet MS, Verdana, sans-serif',
                 color: '#000',
                },
                itemMarginTop: 7,
                itemMarginBottom: 7,
                enabled: true,
                layout: 'vertical',
                align: 'left',
                useHTML: true,
                verticalAlign: 'middle',
                labelFormatter: function() {
                    return '<div style="width:200px;"><span style="float:left">' + this.name + '</span></div>';
                }
            },
            series: [{
                type: 'pie',
                dataLabels:{
                    
                },
                data: pie_data
            }]
        });
        var afik_names = [];
        var yields = [];
        var holding = [];
        var min=100,max=-100;
        for (var i=0; i<sp.maslulArr.afikim.length; i++) {
            afik_names.push(sp.maslulArr.afikim[i].afik_name);
            var currentHolding = parseFloat(sp.maslulArr.afikim[i].afik_holding_percent)
            holding.push(currentHolding);
            var currentYield = parseFloat(sp.maslulArr.afikim[i].annual_yield);
            yields.push(currentYield);
            if (currentHolding > max) {
                max = currentHolding;
            }
            if (currentYield > max) {
                max = currentYield;
            }
            if (currentHolding < min) {
                min = currentHolding;
            }
            if (currentYield < min) {
                min = currentYield;
            }
            // yields.push(parseFloat(-30));

        }
        min = min - 5;
        max = max + 5;
        console.log(min)
        console.log(max)
        $('#barchart').highcharts({
                chart: {
                    type: 'column'
                },
                credits:{enabled: false},
                // colors:['#ff0000', '#ffff00', '#bfff00', '#00ff00', '#00ffff','#0000ff', '#ff00bf', '#ffcf00', '#d0aa19'],
                title: {
                    text: sp.language.Maslul_Column_Graph_Title,//Monthly Average Rainfall
                    style: {
                        color: '#000',
                        fontWeight: 'bold',
                        "fontSize": "2.0em",
                        floating:true,
                    }, margin:0
                },
                subtitle: {
                    text: ''//Source: WorldClimate.com
                },
                xAxis: {
                    // gridLineWidth: 1,
                    
                    categories: afik_names,//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    crosshair: true
                },
                yAxis: {
                    labels: {
                        format: '{value} %'
                    },
                    min:parseInt(min),
                    max:parseInt(max),
                    tickInterval: 5,
                    // min: 0,
                    // gridLineWidth: 1,
                    title: {
                        text: ''//Rainfall (mm)
                    }//,
                    // tickAmount: 9
                    
                    // minorTickLength: 0
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            format: '{point.y:.1f} %',
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },

                        pointPadding: 0.0, //space between grouped bars
                        groupPadding: 0.1
                    },
                    column: {
                        pointPadding: 2.9, //
                        borderWidth: 0.1
                        // colorByPoint: true
                    },
                    // dataLabels: {

                    //     enabled: true,
                    //     align: 'right',
                    //     color: '#FFFFFF',
                    //     x: -10
                    // },
                    // pointPadding: 0.1,
                    // groupPadding: 0,

                    legend: {
                        // layout: 'vertical',
                        // align: 'right',
                        verticalAlign: 'top',
                        // x: -40,
                        // y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                },
                series: [{
                    name: 'Yield Return',
                    data: yields,//[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                    color: '#00ff00',
                    negativeColor: '#ff0000'

                }, {
                    name: 'Holding Percentage',
                    data: holding,//[83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    color: '#0000ff',
                    negativeColor: '#d0aa19'
                }]
            });
    }
   
}]);
