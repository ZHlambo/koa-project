var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");
var superagent = require("superagent");
var array = [];
var sql = require("./sql");
var intervalTime = 500;

function getDataToSql(url, option, func) {
  superagent.get(url).end(function(err, pres) {
    var $ = cheerio.load(pres.text);
    var text = $(option);
    for (var i = 0; i < text.length; i++) {
      var has = false;
      for (var j = 0; j < array.length; j++) {
        if (array[j].text == text.eq(i).text()) {
          has = true;
        }
      }
      if (!has) {
        var obj = {
          text: text.eq(i).text() || "无数据dord",
          url
        }
        sql(obj);
        array.push(obj);
      }
    }
    func(text);
  })
}

function getJanDan(page) {
  getDataToSql(`http://jandan.net/duan/page-${page}#comments`, ".text p", function(text) {
    if (page != 169) {
      setTimeout(function() {
        page = page + 1;
        console.log(page);
        getJanDan(page);
      }, intervalTime);
    } else {
      console.log(JSON.stringify(array));
    }
  });
}

function getBDJ(page) {
  getDataToSql(`http://www.budejie.com/text/${page}`, ".j-r-list-c-desc a", function(text) {
    if (text.length) {
      setTimeout(function() {
        console.log(page, JSON.stringify(array));
        page = page + 1;
        getBDJ(page);
      }, intervalTime);
    } else {
      console.log(JSON.stringify(array));
      array = [];
      getJanDan(1);
    }
  })
}

getBDJ(1);
