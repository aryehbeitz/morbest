$(function() {

    $('#side-menu').metisMenu();


});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size

$(function() {
    window.showNavbar = true;
    window.toggleNavbar = function() {
        // console.log("toggl sidebar");

        if (window.showNavbar) { //showing and want to hide
            $("#page-wrapper").css({"margin": "0"});
            $('div.navbar-collapse').addClass('collapse');
            $('#side-menu').hide();
        }
        else if (!window.showNavbar) {
            $("#page-wrapper").css({"margin": "0 0 0 250px"});
            $('div.navbar-collapse').removeClass('collapse');
            $('#side-menu').show();
        }
        window.showNavbar = !window.showNavbar;
        
    }

    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
    setTimeout(function(){ 
        //window.toggleNavbar();
     }, 1000);
    
});
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  // var month = months[a.getMonth()];
  var month = a.getMonth()+1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '-' + pad(month,2) + '-' + pad(date,2) + '\n' + pad(hour,2) + ':' + pad(min,2) + ':' + pad(sec,2) ;
  return time;
}
function pad(n, width, z) {
  if ($.isNumeric(n)) { 
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  else return n;
}
function timeConvert(dtdt){
  var a = new Date(dtdt);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  // var month = months[a.getMonth()];
  var month = a.getMonth()+1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '-' + pad(month,2) + '-' + pad(date,2);
  return time;
}
Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}