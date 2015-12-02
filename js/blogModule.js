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

    var cantFind = function( element, array ) {
	for ( var ii=0; ii < array.length; ii++ ) {
	    if ( element == array[ii] ) {
		return false;
	    }
	}
	return true;
    }

    this.articles = [ ];
    this.authors = [ ];
    this.categories = [ ];
    this.dates = [ ];
    
    this.init = function( rawData ) {
	for( var ii=0; ii < rawData.length; ii++ ) {
	    this.articles.push( new Article( blogData[ii] ) );

	    if ( cantFind( blogData[ii].author, this.authors ) ) {
		this.authors.push( blogData[ii].author );
	    }
	    if ( cantFind( blogData[ii].category, this.categories ) ) {
		this.categories.push( blogData[ii].category );
	    }

	}
	//this.sortArticlesByDate();
	this.articles.sort(byDate);
	for( var ii=0; ii < this.articles.length; ii++ ) {
	    this.dates.push( this.articles[ii].publishedOn );
	}
	this.authors.sort();
	this.categories.sort();

	var $authors = $('#authors ul');
	var $categories = $('#categories ul');
	var $dates = $('#dates ul');


	for( var ii=0; ii < this.authors.length; ii++ ) {
	    $authors.append('<li><span class="author">' + this.authors[ii] + '</span></li>' );
	}
	for( var ii=0; ii < this.categories.length; ii++ ) {
	    $categories.append('<li><span class="category">' + this.categories[ii] + '</span></li>' );
	}

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


    my.eventListeners = function() {
	var menuItem = '';
	var itemClass = '';
	var $filters = $('#blogNav > ul > li > ul > li');
	var button = '';
	var $sortButtons = $('.btn-group > span');
	
	$filters.on('click', function() {
	    menuItem = $(this).text();
	    itemClass = $(this).children().attr('class');
	    console.log(menuItem + " " + itemClass);
	    my.blog.filterBy(menuItem, itemClass);
	});

	$sortButtons.on('click', function() {
	    button = $(this).attr('id');
	    console.log(button);
	    my.blog.sortBy(button);
	});
    }			
    my.eventListeners();
    
    return my;
    
})();
