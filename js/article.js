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

    this.toHTML = function() {
	var today = new Date();
	var daysAgo = Math.floor( ( today - this.publishedOn ) / 60 / 60 / 24 / 1000 );
	var $articleHTML = $( '.articleTemplate' ).clone();

	$articleHTML.removeClass( 'articleTemplate' );
	$articleHTML.find( 'h1:first ').html( this.title );
	$articleHTML.find( 'time' ).html( parseInt( daysAgo ) + ' days ago');
	$articleHTML.find( '.article-body' ).html(this.body);
	return $articleHTML;
    }

}
