/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Article( properties ) {
    var parseCrappyDate = function(crappyDate) {
	var year = crappyDate.substr(0, 4);
	var month = crappyDate.substr(5, 2);
	var day = crappyDate.substr(8, 2);
	return new Date( year, month, day );
    }
    
    this.title = properties.title;
    this.category = properties.category;
    this.author = properties.author;
    this.authorURL = properties.authorURL;
    this.publishedOn = parseCrappyDate( properties.publishedOn );
    this.body = properties.body;

    this.toHTML = function() {
	var daysAgo = Math.floor( ( new Date() - this.publishedOn ) / 60 / 60 / 24 / 1000 );
	var $articleHTML = $( '.articleTemplate' ).clone();

	$articleHTML.removeClass( 'articleTemplate' );
	$articleHTML.find( 'h1:first ').html( this.title );
	$articleHTML.find( 'time' ).html( parseInt( daysAgo ) + ' days ago');
	$articleHTML.find( '.article-body' ).html(this.body);
	$articleHTML.append( '<hr>' );
	return $articleHTML;
    }

}
