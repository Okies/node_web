var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

function makeStat(rpath, file) {
  var stats = fs.statSync(file);
  var size = stats.size;
  var dir = rpath + '/' + file;

  var type = 0;
  if(stats.isFile()) type = 1;
  if(stats.isDirectory()) type = 2;

  return {
    name : file,
    type : type,
    size : size,
    dir : dir
  }
}

router.get('/*', function(req, res) {
  console.log('call stream');

  var rootName = 'D:\\root';
  //process.chdir(rootName); //루트 변경
  //console.log('cwd : ' + process.cwd()); //경로

  var req_url = decodeURI(req.url);
  var real_path = '';

  if(req_url == '/') {
    real_path = rootName;
  } else {
    real_path = path.join(rootName, req_url.replace(/\//g, '\\'));
  }
  console.log('req_url : ' + req_url);
  console.log('real_path : ' + real_path);

  if((req_url.split('.').reverse()[0]) == 'mp4') {

    var stat = fs.statSync(real_path);
    var fileSize = stat.size;
    var range = req.headers.range;

    console.log("fileSize : " + stat.size);
    console.log("range : " + range);

    if(range) {
      var parts = range.replace(/bytes=/, "").split("-");
      var start = parseInt(parts[0], 10);
      var end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      var chunkSize = (end - start) + 1;

      console.log("start " + start);
      console.log("end " + end);

      var head = {
        'Content-Range' : "bytes " + start + "-" + end + "/" + fileSize,
        'Accept-Range' : 'bytes',
        'Content-Length' : chunkSize,
        'Content-Type' : 'video/mp4'
      }

      res.writeHead(206, head);
      var file = fs.createReadStream(real_path, {start : start, end : end})
        .on("open", function() {
          file.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    } else {
      var head = {
        'Content-Length' : fileSize,
        'Content-Type' : 'video/mp4'
      }
      res.writeHead(200, head);
      var file = fs.createReadStream(real_path)
        .on("open", function() {
          file.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    }
  }
  else {
    var dir = real_path.replace(rootName, '').replace(/\\/g, '\/');
    console.log('dir : ' + dir);

    process.chdir(real_path);
    console.log('cwd : ' + process.cwd());

    fs.readdir('.\\', function(err, list) {
      if(err) throw err;

      console.log('dir length : ' + list.length);

      var files = [];

      list.forEach(function(file) {
        files.push(makeStat(dir, file));
      });

      console.log('list : ', files);
      res.render('stream.ejs', {
        files : files
      });
    });
  }
});

module.exports = router;
