'use strict';
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}

hexo.extend.filter.register('after_post_render', function(data){
  var config = hexo.config;
  if(config.post_asset_folder){
    var link = data.permalink;
    link = link.substring(getPosition(link, '/', 3) + 1);

    var toprocess = ['excerpt', 'more', 'content'];
    for(var i = 0; i < toprocess.length; i++){
      var key = toprocess[i];

      var $ = cheerio.load(data[key], {
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false
      });

      $('img').each(function(){
        var src = $(this).attr('src');
        if(!/http[s]*.*|\/\/.*/.test(src)){
          // is a local file in post_asset_folder
          src = src.substring(src.indexOf("/") + 1);
          $(this).attr('src', '/' + link + src);
        }
      });
      data[key] = $.html();
    }
  }
});
