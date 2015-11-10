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
            buildTable(countries);
        });

        $('.refreshButton').on('click',function(e){
            e.preventDefault();
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

    function buildTable(countries){
        for (var i = 0; i < countries.length; i++) {
            var countryCode = countries[i].code.toLowerCase();
            $("#resultsTable tbody").append('<tr><th scope="row"><a href="https://itunes.apple.com/'+countryCode+'/app/'+itunesRatings.main.appName+'/id'+itunesRatings.main.appID+'?mt=8">'+countries[i].name+'</a></th><td class="result" id="result_'+countryCode+'" data-country="'+countryCode+'">Loading...</td></tr>');
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
        console.log("Getting rating from "+url);
        $( "#result_"+countryCode ).load( url, function( response, status, xhr ){
            if (status == "error") {
                console.log("Error response from "+url);
                // console.log(response);
                $( this ).html("N/A").addClass('unavailable');
            } else {
                console.log("Got a response from "+url);
                // console.log(response);
                var rating = $( this ).find("span").first().text();
                $( this ).html(rating).addClass('fetched');

                var ratings = [];
                $('td.fetched').each(function(){
                    var theRating = parseFloat($(this).text());
                    if(theRating > 0) {
                        ratings.push(theRating);
                    }
                });
                if (ratings.length > 0) {
                    var average = getAvg(ratings);
                    $("#averageRating").html(average);
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
