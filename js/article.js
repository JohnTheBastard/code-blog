/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Article( properties ) {
    this.title = properties.title;
    this.category = properties.category;
    this.author = properties.author;
    this.authorURL = properties.authorURL;
    this.publishedOn = new Date(properties.publishedOn);
    this.body = properties.body;
    this.wordCount = properties.wordCount || 0;

    var pad = function(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
    }
    
    this.toHTML = function() {
	var today = new Date();
	var daysAgo = Math.floor( ( today - this.publishedOn ) / 60 / 60 / 24 / 1000 );
	var dateTimeString = this.publishedOn.getFullYear() + "-"
	    + pad( this.publishedOn.getMonth() + 1, 2 ) + "-"
	    + pad( this.publishedOn.getDate(), 2);
	
	// Get template script
	var articleHTML = $( '#articleTemplate' ).html();
	// Compile template
	var template = Handlebars.compile(articleHTML);
	// Define context
	var context={ "title":        this.title,
		      "timeStamp":    dateTimeString,
		      "relativeDate": parseInt( daysAgo ) + ' days ago',
		      "body":         this.body };
	var compiledHTML = template(context);

	return $('<div></div>').html(compiledHTML);
    }

}
