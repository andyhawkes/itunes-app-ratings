# itunes-app-ratings
A simple tool to aggregate app store ratings for iOS apps

iTunes does not make it easy to view an aggregated rating for apps which are available in multiple countries.

This simple page will scrape the store pages for all supported locales and provide the average rating per store, and an average of all available stores.

## Input

You can enter either:

* A valid app store URL (e.g. https://itunes.apple.com/us/app/youtube/id544007664?mt=8)

or

* A valid app ID (e.g. '544007664'), and
* A valid app name (e.g. 'youtube')

The vaid app store URL is probably the easiest option ;-)

## Output

Submitting the form will scrape the app page for all of the supported countries' app stores (these are defined in /assets/js/countries.json)

The table of results will be updated as follows:

* App unavailable in store: no rating shown
* App available in store but no rating available: rating of 0 shown
* App available in store and has a rating: average rating shown

Note: the average rating will be show to as many decimal places as iTunes returns. Usually it is shown in increments of 0.5 stars on the store page, but the average rating can actually be delivered to multiple decimal places.

## Disclaimer

The code is very "quick & dirty" - the Javascript is sloppy, the CSS is minimal, and the HTML is basic.

Feel free to polish it up a bit - pull requests are welcome!
