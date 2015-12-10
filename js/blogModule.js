/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

var debug = false;

function Blog() {
    
    // compare functions
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

    // filter functions
    var onlyUnique = function(value, index, self) { return self.indexOf(value) === index; }

    // other useful functions
    var castArticle = function(articleData) { return new Article( articleData ); }

    
    this.articles = [ ];
    this.articlesToPublish = [ ];
    this.authors = [ ];
    this.categories = [ ];
    this.ETag = "";
    var self = this;
    
    self.init = function() {
	//var blogDataURL = "http://johnthebastard.github.io/code-blog-json/blogArticles.json";
	var blogDataURL = "js/blogArticles.json";
	var localETag = localStorage.getItem('ETag');

	function getETag(url) {
	    var ETag = "";
	    $.ajax({ type: 'HEAD',
			    url: url,
			    async: false,
			    success: function(data, textStatus,xhr) {
				ETag = xhr.getResponseHeader("ETag");
			    }
			  } );
	    return ETag;
	}

	function determineWordCount( article ) {
	    article.wordCount = $(article.body).text().match(/\S+/g).length;
	    return article;
	}

	function processJSON( jsonData, textStatus, xhr ) {
	    //console.log(textStatus);
	    //console.log(xhr);
	    
	    // make Article objects out of the data and store in a sorted array
	    self.articles = jsonData.articles.map( castArticle ).sort(byDate);
	    self.articles = self.articles.map( determineWordCount );
	    // store unique authors and categories in sorted arrays
	    self.authors = self.articles
		.map( function(article) { return article.author; } )
		.filter( onlyUnique )
	        .sort();
	    self.categories = self.articles
		.map( function(article) { return article.category; } )
	        .filter( onlyUnique )
	        .sort();

	    self.ETag = xhr.getResponseHeader('ETag');
	}

	
	self.ETag = getETag(blogDataURL);
	
	if( localETag === self.ETag ) {
	    // blog articles haven't changed, load local copy
	    self.articles = JSON.parse( localStorage.getItem( 'articles' ) ).map( castArticle );
	    self.authors = JSON.parse( localStorage.getItem( 'authors' ) );
	    self.categories = JSON.parse( localStorage.getItem('categories') );
	} else {
	    // local blog articles are out of date, get and store fresh articles 
	    $.ajax( { type: "GET",
		      url: blogDataURL,
		      async: false,
		      dataType: "json",
		      contentType: 'application/json; charset=utf-8',
		      success: processJSON
		    } );
	    localStorage.setItem( 'articles', JSON.stringify(self.articles) );
	    localStorage.setItem( 'authors', JSON.stringify(self.authors));
	    localStorage.setItem( 'categories', JSON.stringify(self.categories));
	    localStorage.setItem( 'ETag', self.ETag );
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

    self.makeVanityPage = function() {
	var vanityProperties = {};

	function calculateAuthorStats( articleWordCounts ) {
	    var authorStats = {};

	    function setStats(pair) {
		authorStats[pair[0]] = {};
		authorStats[pair[0]].totalWords = authorStats[pair[0]].totalWords + pair[1] || pair[1];
		authorStats[pair[0]].totalArticles = authorStats[pair[0]].totalArticles + 1 || 1;
		authorStats[pair[0]].averageWordsPerArticle = authorStats[pair[0]].totalWords / authorStats[pair[0]].totalArticles;
		return 1;
	    }
	    
	    articleWordCounts.map(setStats);
	    return authorStats;
	    
	}
	
	vanityProperties.articleCount = self.articles.length;
	vanityProperties.authorCount = self.authors.length;
	vanityProperties.totalWordCount = self.articles
	    .map( function(article){return article.wordCount;} )
	    .reduce( function(a,b){return a+b;}, 0 ) ;
	
	// I prefer this syntax, but it doesn't have good browser support:
	//vanityProperties.totalWordCount = self.articles.map( ()=>this.wordCount ).reduce( (a,b)=>a+b, 0 );
	vanityProperties.averageWordsPerPost = Math.floor( vanityProperties.totalWordCount / vanityProperties.articleCount );
	
	var articlesAuthorAndWordCount = self.articles.map( function(article) { return [ article.author, article.wordCount ]; } );
	console.log(articlesAuthorAndWordCount);
	vanityProperties.authorStats = calculateAuthorStats( articlesAuthorAndWordCount );

	self.vanityPage = new VanityPage(vanityProperties);
	console.log(self.vanityPage);
	
    }
    
};

var BLOG_MODULE = (function() {
    var my = { };
    my.$anchor = $( "#articles" );
    my.blog = new Blog();

    my.blog.init();

    my.publish = function() {
	$('#adminTools').css('display', 'none');
	$('#articles').css('display', 'block');
	$('#articleTemplate').nextAll().remove();

	my.blog.articlesToPublish.map( function(article) { return my.$anchor.append( article.toHTML() ); } );
    }
    my.publish();

    
    my.eventListeners = function() {
	var $vanityStats = $('#vanityStatsNavElement');
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

	$vanityStats.on('click', function() {
	    $('#articles').css('display', 'none');
	    $('#adminTools').css('display', 'block');
	    my.blog.makeVanityPage();
	    my.$anchor.append( my.blog.vanityPage.toHTML() );
	    
	});
	
    }			
    my.eventListeners();
    
    return my;
    
})();
