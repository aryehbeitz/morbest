'use strict';
angular.module('sbAdminApp')
.controller('QuestionsCtrl', ['$q', '$filter', '$scope', '$timeout', '$http', 'dataService', '$state', '$stateParams', '$animate',  function($q, $filter, $scope, $timeout, $http, dataService, $state, $stateParams, $animate) {
    var q = this;

    //creates 3 variables:
    // localStorage.cookieMd5
    // localStorage.cookieSet
    // localStorage.userId
    // debugger;
    // dataService.cookieInit();


    $animate.enabled(false);

    q.loadData = loadData
    // q.calcRisk = calcRisk;
    q.clickAnswer = clickAnswer;
    q.Next = Next;
    q.Prev = Prev;
    q.toggle = toggle;
    q.firstQ = firstQ
    // q.birth_date = new Date();
    var a = new Date();
    q.day = a.getDate();
    q.year = a.getFullYear();
    q.month = "" + (a.getMonth() + 1);
    var pad = "00"
    q.month = pad.substring(0, pad.length - q.month.length) + q.month;
    q.min_date = new Date((q.year-100) + '-' + q.month + '-' + q.day);
    q.max_date = new Date((q.year-18) + '-' + q.month + '-' + q.day);
    q.yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(q.max_date);
    q.birth_date = q.yesterday;

    q.dataloaded = false;

    //first question before loaded. this is the format to be saved on the database
    q.firstQuestion = [{is_marked:false},{is_marked:false},{is_marked:false},{is_marked:false}];
    //here we set the question to start after
    q.qNumber=0;
    q.answeredQuestions = [];
    loadData();
    q.aa = function() {

    }
    function firstQ(item, index) {
        //when clicking on a checkbox in the first question
        q.firstQuestion[index].is_marked = item.is_open; //good
        q.q_a[q.qNumber].the_answer = q.firstQuestion;

        dataService.serverSend("updateUserAnswer", {userId: localStorage.userId, questionId: q.q_a[q.qNumber].question_id, shortAnswer: JSON.stringify(q.q_a[q.qNumber].the_answer), updateDate:Date.now()})
        .then(function(response) {
            var onemarked = false;
            for (var i=0; i< q.q_a[q.qNumber].the_answer.length; i++) {
                if (q.q_a[q.qNumber].the_answer[i].is_marked == true) {
                    onemarked = true;
                }
                console.log(q.q_a[q.qNumber].the_answer[i])
            }
            if (onemarked == false) {
                q.answeredQuestions[q.qNumber] = undefined;
            }
            else {
                q.answeredQuestions[q.qNumber] = 1;
            }

            // console.log(response.data);
        });
    }
    function toggle(val) {
        if (fal == true) val=false;
        else val=true;
    }
    q.datestring = "";

    q.checkDate = checkDate;
    function isNumeric(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }

    $scope.$watch('q.birth_date', function (newValue) {
        // console.log("watch called " + q.dataloaded + " " + newValue)
        if (q.dataloaded == true &&  typeof newValue !== 'undefined') {
             q.checkDate();
        }
    });    
    $scope.$watch('q.q_a[q.qNumber].short_q_name', function (newValue) {
         q.checkDate();
    });
    // $scope.$watch('q.dataloaded', function (newValue) {
    //     if (q.dataloaded == true) {
    //         q.calcRisk();
    //     }
    // }); 

    function checkDate(){//calcs score for first date
        //only for question 1
        if (q.qNumber != 1) {
            // console.log("exiting");
            return;
        }
        var birth_day = q.birth_date.getDate();
        var birth_month = q.birth_date.getMonth() + 1;
        var birth_year = q.birth_date.getFullYear();

        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        var utc2 = Date.UTC(q.year, q.month, q.day);
        var utc1 = Date.UTC(birth_year, birth_month, birth_day);
        var days_diff =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
        q.q_a[q.qNumber].questions[0].days_diff=days_diff;

        var age=days_diff/365.25;
        q.age=age;
        q.q_a[q.qNumber].questions[0].age=age;
        var age_risk = (65-age*2)/age;
        q.age_risk = age_risk;

        q.q_a[q.qNumber].questions[0].q_weight = Math.min(Math.max(age_risk,q.q_a[q.qNumber].min_weight),q.q_a[q.qNumber].max_weight);
        q.q_a[q.qNumber].the_answer = JSON.stringify({
            "year":birth_year,
            "month":birth_month, 
            "day":birth_day
        });
        q.q_a[q.qNumber].questions[0].short_q_name = q.q_a[q.qNumber].the_answer;

        //after calculating birth date, we calculate the risk
        calcRisk();

    }
   
    function loadData() {
        // console.log("started loadData(), asking server for questions");
        dataService.cookieInit()
            .then(function(response) {
                localStorage.userId = parseInt(response.data);
                localStorage.cookieSet = true;
            //load a list of all questions, answers from database
            dataService.serverSend('getquestions',{})//this loads questions
            .then(function(response) {
                // console.log("received response: ")
                // console.log(response.data)
                var data = response.data;
                // console.log(data);

                q.min_weight=0;
                q.max_weight=0;
                var len = data.length;
                var newdata = [];
                var k;
                for (var i=0; i<len; ) {
                    var q_id = data[i].QuestionID;
                    var obj = {};
                    obj["question_id"] = data[i].QuestionID;
                    obj["internal_name"] = data[i].q_name;
                    obj["description"] = data[i].QuestionDes;
                    obj["min_weight"] = data[i].min_weight;
                    q.min_weight+=parseFloat(data[i].min_weight);
                    q.max_weight+=parseFloat(data[i].max_weight);
                    obj["max_weight"] = data[i].max_weight;
                    if (i==0) obj["the_answer"] = [];
                    else obj["the_answer"] = "";

                    obj["index"] = i;
                    obj["image"] = "http://lorempixel.com/602/300";
                    obj["questions"] = [];
                    for(var k=0,j=i; j<len && data[j].QuestionID == q_id; j++, i++, k++) {
                        obj.questions.push({
                            "question_id":data[j].QuestionID,
                            "short_q_name":data[j].AnswerVar, 
                            "q_weight":data[j].Weight, 
                            "long_q_name":data[j].ShortAnswerDes, 
                            "is_open":false, 
                            "is_marked":false, 
                            "q_name":data[j].q_name,
                            "long_des":data[j].AnswerDes,
                            "b_date_month":"",
                            "b_date_year":"",
                            "its_id":k
                        });
                    }
                    newdata.push(obj);
                }
                q.q_a=newdata;
                q.NumQuestions = Object.keys(q.q_a).length;
                q.dataloaded = true;
                if (localStorage.cookieSet) { //if we are logged in, load saved answers
                    dataService.serverSend('getuseranswers',{userId:localStorage.userId})
                    .then(function(response) {
                        var userData = response.data;

                        for (i=0; i<userData.length; i++) {
                            for (var j=0; j<q.q_a.length; j++) {
                                //find the question
                                if (userData[i].QuestionId == q.q_a[j].question_id) {
                                    if (userData[i].QuestionId == 1) {
                                        // console.log(userData[i].shortAnswer);
                                        // debugger;
                                        try {
                                            q.firstQuestion = JSON.parse(userData[i].shortAnswer);
                                            q.answeredQuestions[j] = 1;
                                        }
                                        catch(err) {
                                            //not marked or saved, so mark as unanswered
                                            q.answeredQuestions[j] = undefined;
                                            q.firstQuestion = [{is_marked:false},{is_marked:false},{is_marked:false},{is_marked:false}];
                                        }
                                        for (var k=0; k<q.firstQuestion.length; k++) {
                                            q.q_a[j].questions[k].is_open = q.firstQuestion[k].is_marked;
                                        }

                                    }
                                    //age question
                                    if (userData[i].QuestionId == 2) {
                                        //age question
                                        //load date for second question
                                        console.log("date answer");
                                        console.log(userData[i].shortAnswer);
                                        var user_dob = JSON.parse(userData[i].shortAnswer); //load date
                                        //loads DOB
                                        if (Object.keys(user_dob).length) {
                                            if (q.birth_date != q.max_date) {
                                                q.answeredQuestions[j] = 1;
                                            } 

                                            q.birth_date = new Date(user_dob.year, parseInt(user_dob.month)-1, user_dob.day);
                                        }
                                    }
                                    // console.log("loading question " + i + " which is id " + userData[i].QuestionId + " and the saved answer is " + userData[i].shortAnswer);
                                    q.q_a[j].the_answer = userData[i].shortAnswer;
                                    console.log(j);
                                    console.log(q.q_a[j].the_answer.length)
                                    if (q.q_a[j].the_answer.length) {
                                        q.answeredQuestions[j] = 1;
                                    }
                                }
                            }
                        }
                    });
                }
            });
        });
    }
    //button to move to next question
    function Next(){
        console.log(typeof q.answeredQuestions[q.qNumber]);
        if (q.qNumber<q.NumQuestions-1) {
            if (typeof q.answeredQuestions[q.qNumber] !== 'undefined') {
                q.qNumber++;
            }
            // checkDate();
        }
    }
    //previous question
    function Prev(){
        if (q.qNumber > 0) {
            q.qNumber--;
            // checkDate();
        }
    }
    function clickAnswer() {
        calcRisk();
        Next();
    }
    //calculates risk
    function calcRisk() {
        var userid = localStorage.userId;
        //takes weight from age answer
        q.totalrisk = parseFloat(q.q_a[1].questions[0].q_weight);
        var j;
        var len = Object.keys(q.q_a).length;
        for (var i=2; i<len; i++) {
            var selected = q.q_a[i].the_answer;
            // if (selected.length < 1) {
            //     continue;
            // }
            var jlen = Object.keys(q.q_a[i].questions).length;
            for (j=0; j<jlen; j++) {
                if (q.q_a[i].questions[j].short_q_name == selected) {
                    q.totalrisk += parseFloat(q.q_a[i].questions[j].q_weight);
                }
            }
        }
        q.totalrisk = q.totalrisk.round(2);//Math.round(q.totalrisk,2);
        q.clientRank = Math.max(((q.totalrisk-q.min_weight)/(q.max_weight-q.min_weight))*10,0);//(q.max_weight*10)/q.totalrisk;// + (q.totalrisk*10)/q.min_weight;
        q.clientRank = q.clientRank.round(2);
        // q.clientRank = ((q.totalrisk-q.min_weight)/(q.max_weight-q.min_weight))*10;//(q.max_weight*10)/q.totalrisk;// + (q.totalrisk*10)/q.min_weight;

        //load selected answer
        var selected = q.q_a[q.qNumber].the_answer
        var jlen = Object.keys(q.q_a[q.qNumber].questions).length;
        //go over questions
        for (j=0; j<jlen; j++) {
            if (q.q_a[q.qNumber].questions[j].short_q_name == selected) {
                //find question and its answer
                //update the answer on the server. this should be called only once per click
                dataService.serverSend("updateUserAnswer", {userId: userid, questionId: q.q_a[q.qNumber].questions[j].question_id, shortAnswer: q.q_a[q.qNumber].questions[j].short_q_name, updateDate:Date.now(), totalrisk:q.totalrisk, clientrank:q.clientRank, cookieid:localStorage.userId})
                .then(function(response) {
                    q.answeredQuestions[q.qNumber] = 1;

                    var answeredQuestions = 0;
                    for (var i=0; i<q.NumQuestions; i++) {
                        console.log("type at " + i + " is " + typeof q.answeredQuestions[i]);
                        if (typeof q.answeredQuestions[i] !== 'undefined') {
                            answeredQuestions++;
                        }
                    }
                    console.log("question number:" + q.qNumber);
                    console.log("total questions: " + q.NumQuestions);
                    console.log("total questions answered: " + answeredQuestions);
                    if (answeredQuestions == q.NumQuestions && q.qNumber == (q.NumQuestions-1))//last
                    {
                        $state.go('dashboard.maslulim',{},{ reload: true });
                    }
                    console.log(response.data);
                });
            }
        }
    }
}]);
