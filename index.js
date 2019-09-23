'use strict';
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}

// For windows style path, we replace '\' to '/'.
function replaceWindowsPath(path = '') {
  return path.replace(/\\/, '/')
}


/**
 * replace src path
 * @param {string} src img tag src attribute
 * @param {string} link replace src
 * @returns {string} new src
 */
function replaceSRC(src, link) {
  if (!( /http[s]*.*|\/\/.*/.test(src)
    || /^\s+\//.test(src)
    || /^\s*\/uploads|images\//.test(src) )) {

    // For "about" page, the first part of "src" can't be removed.
    // In addition, to support multi-level local directory.
    var linkArray = link.split('/').filter(function(elem){
      return elem != '';
    });
    var srcArray = src.split('/').filter(function(elem){
      return elem != '' && elem != '.';
    });
    if(srcArray.length > 1) {
      srcArray.shift();
    }
    src = srcArray.join('/');
    
    return src
  }
}

// console.info function
function info(...args) {
  console.info && console.info(...args)
}

hexo.extend.filter.register('after_post_render', function(data){

  var config = hexo.config;
  if(config.post_asset_folder) {
    var link = data.permalink;
    var beginPos = getPosition(link, '/', 3) + 1;
    var appendLink = '';
    
    // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
    // if not with index.html endpos = link.lastIndexOf('.') + 1 support hexo-abbrlink
    if(/.*\/index\.html$/.test(link)) {
      // when permalink is end with index.html, for example 2019/02/20/xxtitle/index.html
      // image in xxtitle/ will go to xxtitle/index/
      appendLink = 'index/';
      var endPos = link.lastIndexOf('/');
    }
    else {
      // when permalink is end with *.html, for example `p_${abbrlink}.html`
      if (/.*\.html/.test(link)) {
        var endPos = link.lastIndexOf('.html')
      }
      else {
        var endPos = link.length-1;
      }
    }
    link = link.substring(beginPos, endPos) + '/' + appendLink;


    var toprocess = ['excerpt', 'more', 'content'];
    for(var i = 0; i < toprocess.length; i++) {
      var key = toprocess[i];

      var $ = cheerio.load(data[key], {
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false,
        decodeEntities: false
      });


      $('img').each(function(){
        
        // can't find src attribute
        if (!$(this).attr('src')) {
          info("no src attr, skipped...")
          info($(this))
          return true
        }

        // img tag src attribute
        var src = replaceWindowsPath($(this).attr('src'))
        src = replaceSRC(src, link)
        if (src) {
          $(this).attr('src', config.root + link + src)
          info("src update link as:-->" + config.root + link + src);
        }

        // support hexo-lazyload-image plugin
        var lazySrc = replaceWindowsPath($(this).data('original'))
        lazySrc = replaceSRC(lazySrc, link)
        if (lazySrc) {
          $(this).attr('data-original', config.root + link + lazySrc);
          info("data-original update link as:-->" + config.root + link + lazySrc);
        }

      });
      data[key] = $.html();
    }
  }
});