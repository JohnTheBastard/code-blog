/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

var debug = false;

function Blog() {
    
    var alphabetical = function(a, b) {
	var A = a.toLowerCase();
	var B = b.toLowerCase();
	if(A < B) {
	    //console.log( A + " < " + B  + " => -1" );
            return -1;
	} else if (A > B) {
	    //console.log( A + " > " + B  + " => 1" );
	    return  1;
	} else {
	    return 0;
	}
    };
    
    var alphabeticalReversed = function(a, b) {
	var A = a.toLowerCase();
	var B = b.toLowerCase();
	if(A > B) {
	    //console.log( A + " > " + B  + " => -1" );
            return -1;
	} else if(A < B) {
	    //console.log( A + " < " + B  + " => 1" );
	    return  1;
	} else {
	    return 0;
	}
    };
    
    var byDate = function( a, b ) { return b.publishedOn - a.publishedOn };
    var byDateReversed = function( a, b ) { return a.publishedOn - b.publishedOn };
    var byAuthor = function(a, b) { return alphabetical( a.author, b.author ) };
    var byAuthorReversed = function(a, b) { return alphabeticalReversed( a.author, b.author ) };
    var byTitle = function(a, b)  { return alphabetical( a.title, b.title ) };
    var byTitleReversed = function(a, b)  { return alphabeticalReversed( a.title, b.title ) };

    var cantFind = function( element, array ) {
	for ( var ii=0; ii < array.length; ii++ ) {
	    if ( element == array[ii] ) {
		return false;
	    }
	}
	return true;
    }

    this.articles = [ ];
    this.articlesToPublish = [ ];
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

	this.articles.sort(byDate);
	for( var ii=0; ii < this.articles.length; ii++ ) {
	    this.dates.push( this.articles[ii].publishedOn );
	}
	this.authors.sort();
	this.categories.sort();

	this.articlesToPublish = this.articles;
	
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

    this.sortBy = function( sortMethod ) {

	
	if( sortMethod == "authAsc" ) {
	    this.articlesToPublish.sort(byAuthor);
	} else if( sortMethod == "authDesc" ) {
	    this.articlesToPublish.sort(byAuthorReversed);
	} else if( sortMethod == "dateAsc" ) {
	    this.articlesToPublish.sort(byDate);
	} else if( sortMethod == "dateDesc" ) {
	    this.articlesToPublish.sort(byDateReversed);
	} else {
	    console.log("Error: unable to sort on " + sortMethod );
	}
	
	for ( var ii=0; ii < this.articlesToPublish.length; ii++ ) {
	    tempAuthors.push(this.articlesToPublish[ii].author);
	}

	if(debug) {
	    var tempAuthors = [];
	    for ( var ii=0; ii < this.articlesToPublish.length; ii++ ) {
		tempAuthors.push(this.articlesToPublish[ii].author);
	    }
	    console.log(tempAuthors);
	}
	
    }

};

var BLOG_MODULE = (function() {
    var my = { };
    my.$anchor = $( "#articles" );
    my.blog = new Blog();

    my.blog.init( blogData );

    my.publish = function() {
	$('.articleTemplate').nextAll().remove();
	for( var ii=0; ii < my.blog.articlesToPublish.length; ii++ ) {
	    my.$anchor.append( my.blog.articlesToPublish[ii].toHTML() );
	}
    }
    my.publish();

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
	    //my.blog.filterBy(menuItem, itemClass);
	    my.publish();
	});

	$sortButtons.on('click', function() {
	    button = $(this).attr('id');
	    console.log(button);
	    my.blog.sortBy(button);
	    my.publish();
	});
    }			
    my.eventListeners();
    
    return my;
    
})();
