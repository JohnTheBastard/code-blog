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
    var self = this;
    
    this.init = function() {
	function processJSON( jsonData ) {
	    for( var ii=0; ii < jsonData.articles.length; ii++ ) {
		self.articles.push( new Article( jsonData.articles[ii] ) );
		if ( cantFind( jsonData.articles[ii].author, self.authors ) ) {
		    self.authors.push( jsonData.articles[ii].author );
		}
		if ( cantFind( jsonData.articles[ii].category, self.categories ) ) {
		    self.categories.push( jsonData.articles[ii].category );
		}
	    }
	}
	var blogDataURL = "http://johnthebastard.github.io/code-blog-json/blogArticles.json";
	var $blogData = $.ajax( { type: "GET",
				  url: blogDataURL,
				  async: false,
				  dataType: "json"
				} );
	
	$blogData.done( processJSON );
	
	self.articles.sort(byDate);
	for( var ii=0; ii < self.articles.length; ii++ ) {
	    self.dates.push( self.articles[ii].publishedOn );
	}
	self.authors.sort();
	self.categories.sort();
	self.articlesToPublish = self.articles;
	
	var $authors = $('#authors ul');
	var $categories = $('#categories ul');
	var $dates = $('#dates ul');
	    
	for( var ii=0; ii < self.authors.length; ii++ ) {
	    $authors.append('<li><span class="author">' + self.authors[ii] + '</span></li>' );
	}
	for( var ii=0; ii < self.categories.length; ii++ ) {
	    $categories.append('<li><span class="category">' + self.categories[ii] + '</span></li>' );
	}
    }
    
    
    
    self.sortBy = function( sortMethod ) {
	if( sortMethod == "authAsc" ) {
	    self.articlesToPublish.sort(byAuthor);
	} else if( sortMethod == "authDesc" ) {
	    self.articlesToPublish.sort(byAuthorReversed);
	} else if( sortMethod == "dateAsc" ) {
	    self.articlesToPublish.sort(byDate);
	} else if( sortMethod == "dateDesc" ) {
	    self.articlesToPublish.sort(byDateReversed);
	} else {
	    console.log("Error: unable to sort on " + sortMethod );
	}

	/*
	if(debug) {
	    var tempAuthors = [];
	    for ( var ii=0; ii < this.articlesToPublish.length; ii++ ) {
		tempAuthors.push(this.articlesToPublish[ii].author);
	    }
	    console.log(tempAuthors);
	}
	*/
    }

    self.filterBy = function( filter, attribute ) {
	self.articlesToPublish = [ ];
	for( var ii=0; ii < self.articles.length; ii++ ) {
	    if( ( attribute == "author" && filter == self.articles[ii].author ) ||
		( attribute == "category" && filter == self.articles[ii].category ) ) {
		self.articlesToPublish.push( self.articles[ii] );
	    }
	}
    }
    
};

var BLOG_MODULE = (function() {
    var my = { };
    my.$anchor = $( "#articles" );
    my.blog = new Blog();

    my.blog.init();

    my.publish = function() {
	$('.articleTemplate').nextAll().remove();
	for( var ii=0; ii < my.blog.articlesToPublish.length; ii++ ) {
	    my.$anchor.append( my.blog.articlesToPublish[ii].toHTML() );
	}
    }
    my.publish();

    //console.log(JSON.stringify(my.blog.articles));
    
    my.eventListeners = function() {
	var $resetPublishedArticles = $( '#resetToAllArticles' );
	var $filters = $( '#blogNav > ul > li > ul > li' );
	var $sortButtons = $( '.btn-group > span' );


	$resetPublishedArticles.on('click', function() {
	    my.blog.articlesToPublish = my.blog.articles;
	    my.publish();
	});
	
	$filters.on('click', function() {
	    var menuItem = $(this).text();
	    var itemClass = $(this).children().attr('class');
	    my.blog.filterBy(menuItem, itemClass);
	    my.publish();
	});

	$sortButtons.on('click', function() {
	    var button = $(this).attr('id');
	    console.log(button);
	    my.blog.sortBy(button);
	    my.publish();
	});
    }			
    my.eventListeners();
    
    return my;
    
})();
