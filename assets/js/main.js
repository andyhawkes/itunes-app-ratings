/**
 * @fileoverview iTunes app ratings main file
 */

/**
 * Global variables for accessing html elements
 * @export
 * @type {Object}
 */
var $html = $('html');
var $body = $html.find('body');
var $footer = $body.find('.footer');
var $header = $body.find('.header');

/**
 * itunesRatings - the global namespace
 * @export
 * @type {Object}
 */
var itunesRatings = itunesRatings || {};

itunesRatings.main = (function(){

    var appID = "",
        appName = "";

    function init(){

        $('.formSubmit').on('click', function(e){
            e.preventDefault();
            checkAppID($('input[name=appID]').val());
            checkAppName($('input[name=appName]').val());
            checkAppURL($('input[name=appURL]').val());
            $(this).blur();
            buildTable(countries);
        });

        $('.refreshButton').on('click',function(e){
            e.preventDefault();
            $(this).blur();
            refresh();
        });
    }

    function checkAppID(id){
        itunesRatings.main.appID = id;
        // console.log('Checking ID: '+id);
        // console.log('App ID = '+itunesRatings.main.appID);
        // return true;
    }

    function checkAppName(name){
        itunesRatings.main.appName = name;
        // console.log('Checking name: '+name);
        // console.log('App name = '+itunesRatings.main.appName);
    }

    function checkAppURL(url){
        //https://itunes.apple.com/cz/app/new-happy-studio/id1030805441?mt=8
        var re = new RegExp("^https?:\/\/itunes.apple.com\/[a-zA-Z]{2}\/app\/([a-zA-Z-]*)\/id([0-9]*)?.*$");
        var parsedURL = re.exec(url);
        itunesRatings.main.appName = parsedURL[1];
        itunesRatings.main.appID = parsedURL[2];
    }

    function buildTable(countries){
        $('.result-row').remove();
        for (var i = 0; i < countries.length; i++) {
            var countryCode = countries[i].code.toLowerCase();
            $("#resultsTable tbody").append('<tr class="result-row"><th scope="row"><a href="https://itunes.apple.com/'+countryCode+'/app/'+itunesRatings.main.appName+'/id'+itunesRatings.main.appID+'?mt=8">'+countries[i].name+'</a></th><td class="result" id="result_'+countryCode+'" data-country="'+countryCode+'">Loading...</td></tr>');
        }
        $('.results').show();
        fetchRatings();
    }

    function fetchRatings(){
        for (var i = 0; i < countries.length; i++) {
            var countryCode = countries[i].code.toLowerCase();
            getRating(countryCode, itunesRatings.main.appID, itunesRatings.main.appName);
        }
    }

    function getRating(countryCode, appID, appName){
        var url = "https://itunes.apple.com/"+countryCode+"/app/"+appName+"/id"+appID+"?mt=8 span[itemprop=ratingValue]";
        // console.log("Getting rating from "+url);
        $( "#result_"+countryCode ).load( url, function( response, status, xhr ){
            if (status == "error") {
                // console.log("Error response from "+url);
                // console.log(response);
                $( this ).html("N/A").addClass('unavailable');
            } else {
                // console.log("Got a response from "+url);
                // console.log(response);
                var rating = $( this ).find("span").first().text();
                $( this ).html(rating).addClass('fetched');
                if(rating == "") {
                    $(this).parent().addClass('unavailable');
                }

                var ratings = [];
                $('td.fetched').each(function(){
                    var theRating = parseFloat($(this).text());
                    if(theRating > 0) {
                        ratings.push(theRating);
                    }
                });
                if (ratings.length > 0) {
                    var average = getAvg(ratings);
                    $(".averageRating").html(average);
                }
            }
        });
    }

    function refresh(){
        $('.result').text("Loading...");
        $("#averageRating").text("Calculating...");
        fetchRatings();
    }

    return {
        init: init
    };

})();

//Helper functions
function getAvg(arr) {
    return arr.reduce(function (p, c) {
        return p + c;
    }) / arr.length;
}

//Initialise
$(function() {
    itunesRatings.main.init();
});
