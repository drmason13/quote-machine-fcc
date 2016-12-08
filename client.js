var quoteStore = [],
  requests = 0,
  requesting = false,
  url = 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=',
  tweetUrl = 'https://twitter.com/intent/tweet?hashtags=design&related=freecodecamp&text=';
  //codepen web hack for https -> http CORS
  //url = 'https://crossorigin.me/' + url;

function Quote(text, author) {
  this.text = text;
  this.author = author;
}

$('document').ready(function () {
  'use strict';
  var quoteBox = $('.quote-box'),
    authorTarget = $('#author'),
    nextButton = $('#next'),
    tweetButton = $('#tweet');

  Quote.prototype.drawSelf = function () {
    quoteBox.css({ fontSize: 11 - Math.log2(this.text.length + this.author.length) + 'em' });
    quoteBox.find('.quote').remove();
    quoteBox.prepend(this.text);
    quoteBox.find('p').not('#author').addClass('quote scale-text');
    authorTarget.text(this.author);
    var currentQuote = quoteBox.find('.quote').filter(':visible');
    tweetButton.attr('href', tweetUrl + currentQuote.text() + " " + authorTarget.text());
  };

  function requestQuotes(howMany) {
    requests += 1;
    requesting = true;
    $.ajax(
      {
        url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=" + howMany.toString(),
        method: 'GET',
        dataType: 'json',
        cache: false,
        success: function (response) {
          for (var i = 0; i < response.length; i++){
            quoteStore.push(new Quote(response[i].content, response[i].title))
          }
        requests -= 1;
        if (requests == 0) { requesting = false; }
        }
      }
    );
  }

  function clickHandler() {
    // if there are quotes in the quoteStore, display one, then replenish the store by requesting another quote
    if (quoteStore.length) {
      quoteStore.pop().drawSelf();
      requestQuotes(1);
    }
    // if there are 1 or fewer quotes in the store, make an Ajax request for more.
    if (!(requesting) && quoteStore.length <= 1) {
      requestQuotes(3);
    }
  }
  requestQuotes(3);
  nextButton.on('click', clickHandler);
});
