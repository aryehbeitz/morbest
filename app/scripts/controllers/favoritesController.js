'use strict';
angular.module('sbAdminApp')
    .controller('FavoritesCtrl', ['$scope', '$timeout', '$http', 'dataService', '$stateParams', '$q', '$log', 'localStorageService', 
            function($scope, $timeout, $http, dataService, $stateParams, $q, $log, localStorageService) {
        var favorites = this;
        //http://embed.plnkr.co/N0z6ud/
        //http://jsfiddle.net/joshdmiller/NDFHg/
        //http://blog.jaykanakiya.com/angular-js-todo-list-sortable/
        favorites.updateData = updateData;
        favorites.groupnames = [];
        favorites.groups = [];
        favorites.groupready = false;
        favorites.init = init;
        favorites.newCategory = "";
        favorites.showMultiActions = false;
        favorites.listReady = false; //show list of items in category, only after data loaded
        favorites.currentlyRunning = false;//true when in middle of run to show status

        //when clicking on action for a single item
        favorites.selectedSymbol = "";
        favorites.selectedGroupName = "";
        favorites.pasteCsv = "";
        favorites.addCsv = addCsv;
        favorites.addNewCategory = addNewCategory;
        favorites.runItem = runItem;
        favorites.mouseDown = mouseDown;
        favorites.mouseUp = mouseUp;
        favorites.inBuySell = inBuySell;
        favorites.deleteTodoSelected = deleteTodoSelected;
        favorites.checks = checks;
        favorites.invertSelection = invertSelection;
        favorites.selectAll = selectAll;

        function invertSelection() {
            var allUnselected = true;
            //go over items in current list
            for (var i=0; i<favorites.groups[favorites.currentShow].list.length; i++) {
                //find items that are selected
                //invert them
                if (favorites.groups[favorites.currentShow].list[i].isDone == true) {
                    favorites.groups[favorites.currentShow].list[i].isDone = false;
                }
                else {
                    favorites.groups[favorites.currentShow].list[i].isDone = true;
                }
                if (favorites.groups[favorites.currentShow].list[i].isDone == true) {
                    allUnselected = false;
                }
            }
            if (allUnselected == true){
                favorites.showMultiActions = false;
            }
        }
        function selectAll() {
            //go over items in current list
            for (var i=0; i<favorites.groups[favorites.currentShow].list.length; i++) {
                favorites.groups[favorites.currentShow].list[i].isDone = true;
            }
            favorites.showMultiActions = true;
        }
        //tells us if any of current selected category is checked, so show actions or not
        function addCsv() {
            var tmp = favorites.pasteCsv;
            // favorites.pasteCsv
            
            if (tmp.indexOf(",") == -1) {
                //no commas, so break by something else (spaces)
                //remove spaces, rejoin by commas, then split by commas
                tmp = tmp.split(' ').join(',').split(',');
            }else {
                //remove spaces, rejoin, then split by commas
                tmp = tmp.split(' ').join('').split(',');
            }
            //current category: favorites.currentShow
            var groupid = favorites.groups[favorites.currentShow].groupid;
            // console.log(favorites.groups);
            // console.log("groupid: "+groupid);
            var work =[];
            for (var i=0; i<tmp.length; i++) {
                var obj = {"symbol":tmp[i],"groupid":groupid};
                work.push(obj);
                // addfav(tmp[i],groupid);
                favorites.groups[favorites.currentShow].list.push(obj);
                favorites.groups[favorites.currentShow].count++;
            }
            dataService.addFav(
                JSON.stringify(work)
            ).then(function(response) {
                // console.log(response.data);
            });
        }
        //checks if at least one item is selected, and sets internal variables
        function checks() {
            favorites.showMultiActions = false;
            for (var i=0; i<favorites.groups[favorites.currentShow].list.length; i++) {
                if (favorites.groups[favorites.currentShow].list[i].isDone == true) {
                    favorites.showMultiActions = true;
                    return;
                }
            }
        }
        //for views of not buy/sell
        function inBuySell() {
            if (favorites.currentShow == 1 || favorites.currentShow == 0) {
                return true;
            }
            return false;
        }
        function addNewCategory() {
            dataService.addNewCategory(favorites.newCategory)
            .then(function(response){
                var found = false;
                for (var i=0; i<favorites.groups.length; i++) {
                    if (favorites.groups[i].name == favorites.newCategory) {
                        found = true;
                    }
                }
                if (found != true) {
                    var obj = {"list":[],"name":favorites.newCategory};
                    favorites.groups.push(obj);
                    favorites.groupnames.push(favorites.newCategory);
                    
                }
                // console.log(response.data);
                // console.log(favorites.groups);
            });
        }
        function updateData() {
            dataService.getStockSuggestions(favorites.textInput)
            .then(function(response){
                favorites.data = response.data;
                init();//reload data
            });
            
        }

        //we return list of groups besides my own and besides buy/sell
        //then we show list to add to
        function mouseDown(symbol, groupname, $event) {
            //used only when selecting one
            favorites.selectedSymbol = symbol;
            favorites.selectedGroupName = groupname;
            favorites.left = angular.element($event.target).prop('offsetLeft');
            favorites.top =angular.element($event.target).prop('offsetTop');
            
            // console.log($event.currentTarget.parentNode.id);

            //remove
            var mygroups =[];
            mygroups = favorites.groupnames.slice(); //make a copy so we dont' hurt original
            mygroups.splice(0, 2); //remove buy and sell
            var index = mygroups.indexOf(groupname);
            if (index > -1) {
                mygroups.splice(index, 1);
            }
            var tmpgrp = [];
            for (var i=0; i<mygroups.length; i++) {
                var a = {"name":""};
                a.name=mygroups[i];
                tmpgrp.push(a);

            }
            favorites.mygroups = tmpgrp;
            // console.log(mygroups);
            favorites.showgroups = true;

        }        
        // favorites.dataloaded = false;
        function init() {
            //favorites.groupready = false;
            //favorites.listReady = false;
            //send currently selected group to get appropriate data
            // if (favorites.dataloaded)

            dataService.getFavs()
                .then(function(response){
                     console.log(response.data);
                    var data = response.data[0];
                    var datakeys = Object.keys(data);
                    var tmp = response.data[1];//list of groupnames
                    favorites.groupnames = Object.keys(tmp);//as array
                    var groups = [];
                    for (var i=0; i<favorites.groupnames.length; i++) {
                        var obj = {
                            "groupname":favorites.groupnames[i],
                            "groupid":tmp[favorites.groupnames[i]].groupid,
                            "count":tmp[favorites.groupnames[i]].count
                        };
                        groups.push(obj);
                    }
                    // favorites.groups = groups;
                    var mainobj = [];
                    //go over groups
                    for(var i=0; i<groups.length; i++) {
                        //get current groupname
                        var groupname = groups[i].groupname;
                        var groupid = groups[i].groupid;
                        var count = groups[i].count;
                        //for each group, find and add
                        var obj = {"name":groupname,"list":[], "groupid":groupid, "count":count};
                        // obj["list"] = [];
                        for (var j=0; j<datakeys.length; j++) {
                            if (data[j].the_group == groupid) {
                                //now add all symbols, but only if currently selected - saves render time
                                if (favorites.currentShow == i) {
                                    obj.list.push({symbol:data[j].symbol,symbolname:data[j].symbolname,isDone:(data[j].isdone==1)?true:false,action:data[j].action,actiondate:data[j].action_date,rundate:data[j].run_date,actualshaar:data[j].actual_shaar,firstpair:data[j].first_pair,secondpair:data[j].second_pair,groupid:data[j].the_group, groupname:groupname,newest_date:data[j].newest_date,oldest_date:data[j].oldest_date});
                                }
                            }
                        }
                        mainobj.push(obj);
                    }
                    favorites.groups = mainobj;
                    favorites.groupready = true;
                    favorites.listReady = true;
                    favorites.show = "All";
                    if (favorites.currentShow < 0) {
                        favorites.currentShow = 2; //set to show generic. perhaps take from db?
                    }
                    console.log(mainobj);
                });
            
        }
        
        //depreciated function
        favorites.addTodo = function () {
            /*Should prepend to array*/
            favorites.groups[favorites.currentShow].list.splice(0, 0, {taskName: favorites.newTodo, isDone: false });
            /*Reset the Field*/
            favorites.newTodo = "";
        };

        favorites.deleteTodo = function (item) {

            var index = favorites.groups[favorites.currentShow].list.indexOf(item);
            
            dataService.delFav(
                favorites.groups[favorites.currentShow].list[index].symbol,
                favorites.groups[favorites.currentShow].list[index].groupid
            ).then(function(response) {
                // console.log(response.data);
                favorites.groups[favorites.currentShow].list.splice(index, 1);
                favorites.groups[favorites.currentShow].count--;
            });

        };
        function deleteTodoSelected(){
            favorites.showMultiActions = false;
            var work = [];
            for (var i=0; i<favorites.groups[favorites.currentShow].list.length; i++) {
                //find selected
                if (favorites.groups[favorites.currentShow].list[i].isDone == true) {
                    var obj = {
                        "symbol":favorites.groups[favorites.currentShow].list[i].symbol,
                        "groupid":favorites.groups[favorites.currentShow].list[i].groupid
                    }
                    work.push(obj);
                    favorites.groups[favorites.currentShow].list.splice(i,1);
                    favorites.groups[favorites.currentShow].count--;
                    i--; //we cut one
                }
            }
            //now we want to update database too
            for (i=0; i<work.length; i++) {
                delfav(JSON.stringify(work));
                // setTimeout(function() {
                    // dataService.delFav(
                    //     work[i].symbol,
                    //     work[i].groupid
                    // ).then(function(response) {
                    //     // console.log(response.data);
                    // });
                // }, 50);        
            }
        }
        function delfav(blockdata) {
            dataService.delFav(
                blockdata
            ).then(function(response) {
                // console.log(response.data);
            });
        }
        function movefav(blockdata) {
                dataService.moveFav(blockdata)
                .then(function(response) {
                    // console.log(response.data);
                });
        }
       
        
        function mouseUp(groupname) {
            //move actions for single or multiple items to groups
            //groupname is when we are moving a single item to the groupname group
            
            //from (one selection)
            // console.log(favorites.selectedSymbol);
            // console.log(favorites.selectedGroupName);
            //to (a must, always)
            // console.log(groupname);

            //get groupname:
            console.log(favorites.groups[favorites.currentShow]);
            var fromgroupname = favorites.groups[favorites.currentShow].name;
            var fromgroupid = favorites.groups[favorites.currentShow].groupid;
            var selecteditems = [];

            if (favorites.showMultiActions && (favorites.selectedGroupName == "" || favorites.selectedSymbol == "")) {
                //take care of multiple selected
                // var fromgroupid = 0;
                for (var i=0; i<favorites.groups[favorites.currentShow].list.length; i++) {
                    var obj = {"symbol":"", "groupid":"", "item":""};
                    //get source groupid
                    // fromgroupid = favorites.groups[favorites.currentShow].list[i].groupid;
                    //get selected from currently selected group
                    if (favorites.groups[favorites.currentShow].list[i].isDone == true) {
                        //we have a selected item 
                        //for db
                        obj.symbol = favorites.groups[favorites.currentShow].list[i].symbol;
                        obj.groupid = favorites.groups[favorites.currentShow].list[i].groupid;
                        //for json moving
                        obj.item = favorites.groups[favorites.currentShow].list[i]; //copy entire item
                        //save it in tmp
                        selecteditems.push(obj);
                        //remove from current group
                        favorites.groups[favorites.currentShow].list.splice(i,1);
                        i--;
                    }
                }
                //now we need to add to new group
                //find the new group
                var notfound = true;
                var destgroup=0;
                for (i=0; i<favorites.groups.length && notfound==true; i++) {
                    if (favorites.groups[i].name == groupname) {//we found target group
                        notfound = false;
                        //i is the dest. group id
                        // destgroup = i;
                        destgroup = favorites.groups[i].groupid;
                        //do copy
                        for (var j=0; j<selecteditems.length; j++) {
                            //change internal groupid
                            selecteditems[j].item.groupid = destgroup;
                            //deselect
                            selecteditems[j].item.isDone = false;
                            favorites.groups[destgroup].list.push(selecteditems[j].item);
                        }
                    }
                }
                //now update the database accordingly
                var movdata = [];
                for (i=0; i<selecteditems.length; i++) {
                    var obj = {
                        "symbol":selecteditems[i].symbol,
                        "groupfrom":fromgroupid,
                        "groupto":destgroup
                    }
                    movdata.push(obj);
                }
                console.log(movdata);
                movefav(movdata);
            }
            //now take care of single move
            else {
                var found = false;
                var destgroup=0;
                var fromgroupid=0;
                //first find the item by given symbol
                for (var i=0; i<favorites.groups[favorites.currentShow].list.length && found == false; i++) {
                    if (favorites.groups[favorites.currentShow].list[i].symbol == favorites.selectedSymbol) {
                        //we found the item, so stop searching
                        found = true;
                        //now we need to find destination group id
                        //now we need to add to new group
                        //find the new group
                        var groupnotfound = true;
                        for (j=0; j<favorites.groups.length && groupnotfound==true; j++) {
                            if (favorites.groups[j].name == groupname) {//we found target group
                                groupnotfound = false;
                                //j is the dest. group id
                                // destgroup = j;
                                destgroup = favorites.groups[j].groupid;
                                //do copy from old. i is position in source list
                                var obj = favorites.groups[favorites.currentShow].list[i];
                                obj.isDone = false; //unselect
                                fromgroupid = obj.groupid; //save old group id for db change
                                //update groupid
                                obj.groupid = destgroup;
                                //remove from old position
                                favorites.groups[favorites.currentShow].list.splice(i, 1);
                                //insert into new position
                                favorites.groups[destgroup].list.push(obj);
                            }
                        }
                        //now update the database accordingly
                        var movdata = [];
                        var obj = {
                           "symbol":favorites.selectedSymbol,
                           "groupfrom":fromgroupid,
                           "groupto":destgroup
                       }
                       console.log(obj);
                       movdata.push(obj);
                        dataService.moveFav(movdata).then(function(response) {
                            // console.log(response.data);
                        });    

                    }
                }
            }

            //hide the group selector
            favorites.showgroups = false;
        }
        function runItem(grouptobuy) {
            // console.log(favorites.groups);
            // console.log(grouptobuy);

            favorites.currentlyRunning = grouptobuy;
            //go over all stocks on group
            var runList = []; //list of stocks we want to run
            // console.log(favorites.groups[grouptobuy]);
            //load list of stocks in list
            for (var i=0; i<favorites.groups[grouptobuy].list.length; i++) {
                var obj = {"symbol":"", "groupid":""};
                obj.symbol = favorites.groups[grouptobuy].list[i].symbol;
                obj.groupid = favorites.groups[grouptobuy].list[i].groupid;
                //console.log(obj);
                runList.push(obj);
            }
            // console.log(runList);
            //update all stocks
            var donecount = 0;
            // runList.length = 1;
            dataService.updateStockData(JSON.stringify(runList),1)
            .then(function(response) {
                //console.log(response.data);
            });

        }
        favorites.todoSortable = {
            containment: "parent",//Dont let the user drag outside the parent
            cursor: "move",//Change the cursor icon on drag
            tolerance: "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
        };

        // click to change group. we want to only load whats needed
        //so on init, we load groip names and number of items,
        //but on this click, we send a server request to load currently
        //selected category
        favorites.changeTodo = function (i) {
            favorites.currentShow = i;
            favorites.init();

            // console.log(favorites.currentShow)
        };

        /* Filter Function for All | Incomplete | Complete */
        favorites.showFn = function (todo) {
            if (favorites.show === "All") {
                return true;
            }else if(todo.isDone && favorites.show === "Complete"){
                return true;
            }else if(!todo.isDone && favorites.show === "Incomplete"){
                return true;
            }else{
                return false;
            }
        };

        $scope.$watch("favorites.model",function (newVal,oldVal) {
            // if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
            //     localStorageService.add("todoList",angular.toJson(newVal));
            // }
        },true);

    }]);