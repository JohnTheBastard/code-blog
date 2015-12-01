/* * * * * * * * * * * * * *
 * CODE BLOG               *
 * Created by   John Hearn *
 * CF301       Winter 2015 *
 * * * * * * * * * * * * * */

function Article(properties) {
    this.author = properties.author;
    this.title = properties.title;
    this.body = properties.body;
    this.publishedOn = properties.publishedOn;
}

Article.prototype.toHTML = function() {
  // Here's the old way of templating.
  // How does jQuery let you keep the HTML in the HTML?
  //  return '<article>' +
  //    '<h1>' + this.title +'</h1>' +
  //    '</article>'
}
