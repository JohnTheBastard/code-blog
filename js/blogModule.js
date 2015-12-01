/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Blog() {
    this.articles = [ ];
    
    this.sortArticlesByDate = function() {
	// This is a pretty lazy compare function but our Article object is 
	// using a pretty lazy date format (which should probably be an object
	// itself rather than a string).
	var compareDates = function( a, b ) {
	    if ( a.publishedOn < b.publishedOn )
		return -1;
	    if ( a.publishedOn > b.publishedOn )
		return 1;
	    return 0;
	}
	this.articles.sort( compareDates );
    }

    
    this.init = function( rawData ) {
	for( var ii=0; ii < rawData.length; ii++ ) {
	    this.articles.push( new Article( blogData[ii] ) );
	}

	this.sortArticlesByDate();
    }

};

var BLOG_MODULE = (function() {
    var my = { };
    my.$anchor = $( "#articles" );
    my.blog = new Blog();

    my.blog.init( blogData );

    for( var ii=0; ii < my.blog.articles.length; ii++ ) {
	my.$anchor.append( my.blog.articles[ii].toHTML() );
    }

    return my;
    
})();
