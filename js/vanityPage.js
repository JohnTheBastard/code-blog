/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function VanityPage( properties ) {
    this.articleCount = properties.articleCount;
    this.authorCount = properties.authorCount;
    this.totalWordCount = properties.totalWordCount;
    this.averageWordsPerPost = properties.averageWordsPerPost;
    this.authorStats = properties.authorStats;

    this.toHTML = function() {
	//var $vanityHTML = $( '.vanityTemplate' ).clone();
	//return $vanityHTML;
    }

}
