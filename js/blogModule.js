/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Blog() {
    var byDate = function( a, b ) { return b.publishedOn - a.publishedOn };
    var byDateReversed = function( a, b ) { return a.publishedOn - b.publishedOn };
    var byAuthor = function(a, b) { return b.author - a.author };
    var byAuthorReversed = function(a, b) { return a.author - b.author };
    var byTitle = function(a, b)  { return b.title - a.title };
    var byTitleReversed = function(a, b)  { return a.title - b.title };

    this.articles = [ ];    

    
    this.init = function( rawData ) {
	for( var ii=0; ii < rawData.length; ii++ ) {
	    this.articles.push( new Article( blogData[ii] ) );
	}
	//this.sortArticlesByDate();
	this.articles.sort(byDate);
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
