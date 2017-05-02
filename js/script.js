function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    
    var $wikiHeader = $('#wikipedia-header');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr+', '+cityStr;
    
    $greeting.text('So you want to live in ' + address + '?');
    
    var soureAttr = 'http://maps.googleapis.com/maps/api/streetview?size=1920x1080&location=' + address;
    
    $body.append('<img class="bgimg" src="' + soureAttr + '">');
    
    //NYTimes AJAX request goes here
    var urlNYTimes = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    urlNYTimes += '?' + $.param({
        'api-key': "e83603e0d03b4bc98d520d96bacc5e1b",
        'q': cityStr
    });
    
    $.getJSON(urlNYTimes, function( data ) {
       var articles = data.response.docs;

       $nytHeaderElem.text('New York Times articles about ' + cityStr);

       for(var i = 0; i < articles.length; i ++){
           var article = articles[i];
           $nytElem.append('<li class="article">'+
                               '<a href="' + article.web_url + '" target="_blank">' +
                                   article.headline.main+
                               '</a>'+
                               '<p>' + article.snippet + '</p>'+
                           '</li>');
       }


      // console.log(articles);
    })
    .fail(function(){
       $nytHeaderElem.text('New York Times articles could not be loaded!');
    });
    
    
    
    //Wikipedia AJAX request goes here
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json';
    
    var wikiRequestTimeout = setTimeout(function(){
        $wikiHeader.text('Related Wikipedia articles could not be loaded!');
    }, 8000);
    
    $.ajax( {
        url: wikiURL,
        dataType: 'jsonp',
        success: function(response) {
            console.log(response);
            var articleList = response[1];
            var articleLinkList = response[3]; 
            $wikiElem.text('');
            for(var i = 0; i < articleList.length; i ++){
                var articleStr = articleList[i];
                $wikiElem.append('<li>' +
                                   '<a href="' +articleLinkList[i] + '" target="_blank">' +
                                       articleStr +
                                   '</a>' +
                               '</li>');
            }
            
            clearTimeout(wikiRequestTimeout);
        }
    })/*.fail(function(){
       $wikiHeader.text('Related Wikipedia articles could not be loaded!');
    })*/;
    
    return false;
}

$('#form-container').submit(loadData);