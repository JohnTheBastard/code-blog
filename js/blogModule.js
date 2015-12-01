/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Blog() {
    this.articles = [ ];    
    this.sortArticlesByDate = function() { 
	this.articles.sort( function( a, b ) { return b.publishedOn - a.publishedOn } );
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
