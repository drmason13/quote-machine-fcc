var quoteTarget = $('#quote'),
  authorTarget = $('#author'),
  nextButton = $('#next'),
  quoteStore = [],
  url = 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=';

//codepen web hack for https -> http CORS
url = 'https://crossorigin.me/' + url;

function setURL(howMany) {
  'use strict';
  return url + howMany.toString();
}
function calculateFontSize(chars) {
  // the magic formula - magic numbers alert!
  'use strict';
  return (3 / 2) * (9 - Math.log2(chars));
}

function setFontSize(target, chars) {
  // set font size of quoteTarget using Jquery
  // set font size of authorTarget using Jquery
  'use strict';
  target.css({
    fontSize: calculateFontSize(chars) + "em"
  });
}

var drawQuote = function () {
  'use strict';
  var nextQuote = quoteStore.pop(),
    nextQuoteText = nextQuote.content.slice(3, -5).replace(/&#821[67];|&#39;/g, "'").replace(/&#8230;/g, "...").replace(/&#821[12];/g, "-").replace(/&#822[01];|&#34;/g, '"').replace(/&#33;/g, "!").replace(/&#038;/g, "&"),
    nextQuoteAuthor = nextQuote.title;
  setFontSize(quoteTarget, nextQuoteText.length);
  setFontSize(authorTarget, nextQuoteAuthor.length);
  quoteTarget.text(nextQuoteText);
  authorTarget.text("- " + nextQuoteAuthor);
  quoteTarget.fadeIn({ queue: true });
  authorTarget.fadeIn({ queue: true });
};

function updateQuoteStore(data, callback) {
  //
  'use strict';
  if (quoteStore.length) {
    window.console.log("replacing existing quotes, didn't expect that!");
  } else {
    quoteStore = data;
  }
  callback();
}

var requestQuote = function () {
  // make an Ajax request, then update quoteStore
  'use strict';
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
};

var clickHandler = function () {
  // if quoteStore not empty -> drawQuote
  // else requestQuote
  'use strict';
  if (quoteStore.length) {
    drawQuote();
  } else {
    quoteTarget.fadeOut({ queue: false });
    authorTarget.fadeOut({ queue: false });
    requestQuote();
  }
};
clickHandler();
nextButton.on('click', clickHandler);

