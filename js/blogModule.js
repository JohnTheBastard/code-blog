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
    
    this.articles = [ ];
    this.articlesToPublish = [ ];
    this.authors = [ ];
    this.categories = [ ];
    var self = this;
    
    this.init = function() {
	var blogDataURL = "http://johnthebastard.github.io/code-blog-json/blogArticles.json";
	var $blogData;


	function processJSON( jsonData ) {
	    function onlyUnique(value, index, self) { 
		return self.indexOf(value) === index;
	    }
	    
	    // make Article objects out of the data and store in a sorted array
	    self.articles = jsonData.articles.map( function(articleData) { return new Article( articleData ); } ).sort(byDate);
	    // store unique authors and categories in sorted arrays
	    self.authors = self.articles
		.map( function(article) { return article.author; } )
		.filter( onlyUnique )
	        .sort();
	    self.categories = self.articles
		.map( function(article) { return article.category; } )
	        .filter( onlyUnique )
	        .sort();
	}
	
	if( localStorage.getItem("articles") === null ) {
	    $blogData = $.ajax( { type: "GET", url: blogDataURL, async: false, dataType: "json" } );
	    $blogData.done( processJSON );

	}
	
	self.articlesToPublish = self.articles;

	// Make our navbar menus
	var $authors = $('#authors ul');
	var $categories = $('#categories ul');
	var $dates = $('#dates ul');

	self.authors.map( function( author ) {
	    return $authors.append('<li><span class="author">' + author + '</span></li>' );
	});
	self.categories.map( function( category ) {
	    return $categories.append('<li><span class="category">' + category + '</span></li>' );
	});
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

    }

    self.filterBy = function( selector, attribute ) {
	self.articlesToPublish = self.articles.filter( function(article) { return selector == article[attribute]; });
    }
    
};

var BLOG_MODULE = (function() {
    var my = { };
    my.$anchor = $( "#articles" );
    my.blog = new Blog();

    my.blog.init();

    my.publish = function() {
	$('.articleTemplate').nextAll().remove();

	my.blog.articlesToPublish.map( function(article) { return my.$anchor.append( article.toHTML() ); } );
    }
    my.publish();

    
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
	    my.blog.sortBy(button);
	    my.publish();
	});
    }			
    my.eventListeners();
    
    return my;
    
})();
