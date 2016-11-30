$('document').ready(function () {
  'use strict';
  var quoteTarget = $('#quote'),
    authorTarget = $('#author'),
    nextButton = $('#next'),
    quoteStore = [],
    url = 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=';

  //codepen web hack for https -> http CORS
  url = 'https://crossorigin.me/' + url;

  function setURL(howMany) {

    return url + howMany.toString();
  }
  function calculateFontSize(chars) {
    // the magic formula - magic numbers alert!

    return (11 - Math.log2(chars));
  }

  function setFontSize(target, chars) {
    // set font size of quoteTarget using Jquery
    // set font size of authorTarget using Jquery

    target.css({
      fontSize: calculateFontSize(chars) + "em"
    });
  }
  function drawQuote() {
  // handles both parsing the quote data and updating the dom
    var nextQuote = quoteStore.pop(),
        //quote
      nextQuoteText = nextQuote.content.slice(3, -5).replace(/&#821[67];|&#39;/g, "'").replace(/&#8230;/g, "...").replace(/&#821[12];/g, "-").replace(/&#822[01];|&#34;/g, '"').replace(/&#33;/g, "!").replace(/&#038;/g, "&").replace(/&#163;/g, "£").replace(/&#36;/g, "$").replace(/&#37;/g, "%"),
        //author
      nextQuoteAuthor = nextQuote.title.replace(/&#821[67];|&#39;/g, "'").replace(/&#8230;/g, "...").replace(/&#821[12];/g, "-").replace(/&#822[01];|&#34;/g, '"').replace(/&#33;/g, "!").replace(/&#038;/g, "&");
    setFontSize(quoteTarget, nextQuoteText.length);
    setFontSize(authorTarget, nextQuoteAuthor.length);
    quoteTarget.text(nextQuoteText);
    authorTarget.text("- " + nextQuoteAuthor);
    quoteTarget.fadeIn({ queue: true });
    authorTarget.fadeIn({ queue: true });
  }

  function updateQuoteStore(data, callback) {
    // called from ajax success
    quoteStore = data;
    callback();
  }

  function requestQuote() {
    // make an Ajax request, then update quoteStore
    var tempUrl = setURL(5);
    $.ajax(
      {
        url: tempUrl,
        method: 'GET',
        async: true,
        dataType: 'json',
        cache: false,
        success: function (data) {
          updateQuoteStore(data, drawQuote);
        }
      }
    );
  }

  function clickHandler() {
    // if quoteStore not empty -> drawQuote
    // else requestQuote
    if (quoteStore.length) {
      drawQuote();
    } else {
      quoteTarget.fadeOut({ queue: false });
      authorTarget.fadeOut({ queue: false });
      requestQuote();
    }
  }
  clickHandler();
  nextButton.on('click', clickHandler);
});
