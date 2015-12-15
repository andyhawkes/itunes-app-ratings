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
        appName = "",
        urlRegex = new RegExp("^https?:\/\/itunes.apple.com\/[a-zA-Z]{2}\/app\/([a-zA-Z-]*)\/id([0-9]*)?.*$"),
        ratingsRegex = new RegExp(/([0-9\.]*) [^,]*, ([0-9]*)/);

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
        var parsedURL = urlRegex.exec(url);
        itunesRatings.main.appName = parsedURL[1];
        itunesRatings.main.appID = parsedURL[2];
    }

    function buildTable(countries){
        $('.result-row').remove();
        for (var i = 0; i < countries.length; i++) {
            var countryCode = countries[i].code.toLowerCase();
            $("#resultsTable tbody").append('<tr class="result-row"><th scope="row"><a href="https://itunes.apple.com/'+countryCode+'/app/'+itunesRatings.main.appName+'/id'+itunesRatings.main.appID+'?mt=8">'+countries[i].name+'</a></th><td class="result" id="rating_'+countryCode+'" data-country="'+countryCode+'">Loading...</td><td class="result" id="reviews_'+countryCode+'" data-country="'+countryCode+'">Loading...</td></tr>');
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
        var url = "https://itunes.apple.com/"+countryCode+"/app/"+appName+"/id"+appID+"?mt=8";
        // console.log( "Getting rating for " +countryCode + " from " + url );
        $.get( url, function(data) {
            // console.log( "Retrieved data for " +countryCode );
            var rating = $(data).find('div.rating').attr('aria-label');
            var parsedRating = ratingsRegex.exec(rating);
            rating = (parsedRating && parsedRating.length > 0) ? parsedRating[1] : '0';
            reviews = (parsedRating && parsedRating.length > 1) ? parsedRating[2] : '0';

            var ratingCell = $( "#rating_"+countryCode );
            var reviewsCell = $( "#reviews_"+countryCode );
            var rating = $(data).find('div.rating').attr('aria-label');

            if ( rating != undefined ) {
                // console.log('Rating found for '+countryCode+' - processing rating & review data...');

                var parsedRating = ratingsRegex.exec(rating);
                rating = (parsedRating && parsedRating.length > 0) ? parsedRating[1] : '0';
                reviews = (parsedRating && parsedRating.length > 1) ? parsedRating[2] : '0';
                ratingCell.html(rating).addClass('rated');
                reviewsCell.html(reviews).addClass('reviewed');
                ratingCell.parent().addClass('success');

                var ratings = [];
                $('td.rated').each(function(){
                    var theRating = parseFloat($(this).text());
                    console.log("rating: " + theRating);
                    if(theRating > 0) {
                        ratings.push(theRating);
                    }
                });
                if (ratings.length > 0) {
                    var average = getAvg(ratings);
                    $(".averageRating").html(average);
                }

                var reviews = 0;
                var allReviews = [];

                $('td.reviewed').each(function(){
                    var thisReviews = parseFloat($(this).text());
                    if(thisReviews > 0){
                        reviews += thisReviews;
                        allReviews.push(thisReviews);
                    }
                });
                if (allReviews.length > 0) {
                    var average = getAvg(allReviews);
                    $(".averageReviews").html(average);
                }
                $(".totalReviews").html(reviews);

            } else {
                // console.log('No rating found for '+countryCode+' - marking as unavailable...')
                var ratingCell = $( "#rating_"+countryCode );
                var reviewsCell = $( "#reviews_"+countryCode );
                ratingCell.html("N/A").addClass('unavailable');
                reviewsCell.html("N/A").addClass('unavailable');
                ratingCell.parent().addClass('unavailable');
            }
        }).fail(function() {
            // alert( "error" );
            // console.log('No page found for '+countryCode+' - marking as failed...');
            var ratingCell = $( "#rating_"+countryCode );
            var reviewsCell = $( "#reviews_"+countryCode );
            ratingCell.html("Failed").addClass('failed');
            reviewsCell.html("Failed").addClass('failed');
            ratingCell.parent().addClass('failed');
        });
    }

    function refresh(){
        $('.result').text("Loading...");
        $(".averageRating").text("Calculating...");
        $(".averageReviews").text("Calculating...");
        $(".totalReviews").text("Calculating...");
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
