'use strict';
var https = require('https');
var request = require('request');

var envdetails   = require( '../config/env.js' );
var users   = require( '../config/users.js' );
var logging      = require( '../config/config-log4js.js' );
var logger=logging.LOG;
var fs = require('fs');
 ( function () {
//var token =users.ROLES[userType];
var tENV=process.env.TARGET_ENV||'qa';
var baseurl = envdetails.url[tENV].api;
//var baseurl = 'sf-qa-api.dev.blippar.com';
var trans_ser = envdetails.url[tENV].transcoder;
logger.info('baseurl-------'+baseurl);
logger.info('trans_ser----------:'+trans_ser);

/** Generic reusable fetch method.
*
* fetchapi parameter to be passed.
* Eg: /group/:groupid as '/group/7'
**/
var fetcher = function(role,fetchapi,callback) {
             var resp = '';
             var userrole=role||'blippar_admin';
             var token = users.ROLES[userrole].apiTOKEN;
             var options = {
                 "host": baseurl,
                 "path": '/api'+fetchapi,
                 "headers": {"Authorization":token}
             };

             try{
                    var res = https.get(options, function(response){
                       response.on('data', function(text){
                        resp += text;
                    });

                       response.on('end', function(){
                          callback(resp);
                       });
                    });

                    res.end();
               }
               catch(e){
                    logger.info('FETCH Error');
                    callback(e);
               }
};


/** Generic reusable POST method.
*
* createapi parameter to be passed.
* Eg:
*  1. For Campaign creation '/group/:groupId/campaign' as '/group/7335/campaign
*  2. For Blipp creatoon '/campaign/:campaignId/blipp' as '/campaign/81245/blipp' with body
*  3. For Group creation '/group' as '/group' with body
**/
var creator = function(role,createapi, reqbody, callback) {
        var resp = '';
        var userrole=role||'blippar_admin';
        var token = users.ROLES[userrole].apiTOKEN;
        var options = {
          "method": "POST",
          "host": baseurl,
          "path": "/api"+createapi,
          "headers": { "authorization": token, "cache-control": "no-cache"  }
        };

        try{
                   var res = https.request(options, function (response) {
                             var resp = [];
                             response.on("data", function (text) {
                             resp.push(text);
                         });

                     response.on("end", function () {
                         var body = Buffer.concat(resp);
                         //logger.info("Body "+body.toString());
                         callback(body);
                     });
               });

               res.write(JSON.stringify(reqbody));
               res.end();
        }
        catch(e){
            logger.info('CREATION Error');
            callback(e);
        }
};

/** Generic reusable method.
*
* deleteapi parameter to be passed.
* Eg:
*  1. For Project Deletion '/campaign/:campaignId' as '/campaign/81251'
*  2. For Blipp Deletion '/blipp/:blippId' as '/blipp/130737'
*  3. For Group Deleteion '/group/7407'' as '/group' with body  - Permission Error with Token we have as its Role is Blippar Admin
**/
var remover = function(role,deleteapi,callback) {
        var resp = '';
        var userrole=role||'blippar_admin';
        var token = users.ROLES[userrole].apiTOKEN;
        var options = {
          "method": "DELETE",
          "host": baseurl,
          "path": "/api"+deleteapi,
          "headers": { "Authorization": token, "cache-control": "no-cache"  }
        };

        try{
              var res = https.request(options, function (response) {
              var resp = [];

              response.on("data", function (text) {
                resp.push(text);
              });

              res.on("end", function () {
                 var body = Buffer.concat(resp);
                 // logger.info(body.toString());
                 callback(body);
              });
            });

           res.end();

        }
        catch(e){
           logger.info('DELETION Error');
           callback(e);
        }
};


/** Generic reusable method.
*
*   For Marker Creation bRole, blippid, '/../resources/assets/NASA.jpeg
*   Eg: supportapi.createmarker(bRole, blippid, '/../resources/assets/markerImage.jpeg', callback)
*
**/
var createmarker = function(role, blippid, amarker, callback) {
            var userrole=role||'blippar_admin';
            var token = users.ROLES[userrole].apiTOKEN;
            var mdata = { file: fs.createReadStream(__dirname + amarker)
                                          }

            var options = {
                method: "POST",
                url: "https://"+baseurl+"/api/blipp/"+blippid+"/marker",
                headers: { "content-type":"multipart/form-data",
                           "authorization": token,
                           "cache-control": "no-cache"
                         },
                formData : mdata
           };
           request(options, function(err, response, body) {
                  if (err)
                      callback(err);
                  else{
                      callback(body);
                  }
            });
};


/**
*  Reusable method to submit a file for transcoding
*
*  file as /../assets/file.format
*
**/
// var mediauploader = function(role,afile, callback) {
//   var userrole=role||'blippar_admin';
//   var token = users.ROLES[userrole].apiTOKEN;
//      var transpath = "/api/v1/transcoder/jobs";
//      var formData = {
//              input_file: fs.createReadStream(__dirname + afile)
//           };
//      var options = {
//       method: 'POST',
//   //    timeout: 1200000,
//       port:443,
//       hostname: trans_ser,
//       path: transpath,
//       formData: formData,
//       headers: {
//              accept: '*/*',"Authorization": token,"cache-control": "no-cache","Content-Type": "application/x-www-form-urlencoded"  },
//
//     };
//
//     try{
//       var res = https.request(options, function (response) {
//         logger.info("statusCode: ", response.statusCode);
//          logger.info("headers: ", response.headers);
//          var resp = [];
//
//       response.on("data", function (text) {
//         resp.push(text);
//       });
//
//       response.on("end", function () {
//         var body = Buffer.concat(resp);
//         logger.info(body.toString());
//         callback(body);
//       });
//     });
// //res.end();
//     }catch(e){
//        logger.info('UPLOAD ERROR');
//        callback(e);
//     }
// };
var mediauploader = function(role,afile, callback) {
  var userrole=role||'blippar_admin';
  var token = users.ROLES[userrole].apiTOKEN;
     var transpath = "/api/v1/transcoder/jobs";
     var uri= 'https://'+trans_ser+transpath;
     var formData = {
             input_file: fs.createReadStream(__dirname + afile)
          };

    try{
        var opts = {
          url: uri,
          method: 'POST',
          auth: {
            'bearer':token},
          json: true,
          formData: {
            input_file: fs.createReadStream(__dirname + afile)
          }
        };
          var res = request(opts, function(err, resp, body) {
          if (err !== 'null'){
          logger.info('response status------------------------',resp.statusCode);
        //  logger.info('body ----------------',body);
          logger.info('body job_id----------------',body.job_id);
          callback(body.job_id);
        } else {
          logger.info('error-------------------',err);
          logger.info('response status------------------------',resp.statusCode);
          callback(err);
        }
        });
    }catch(e){
       logger.info('UPLOAD ERROR');
       callback(e);
    }
};

/**
*  Reusable method to retrieve job details of submitted media for transocding
*
*  file as /../assets/file.format
*
**/
var mediapoller = function(role,pollapi,callback) {
            var userrole=role||'blippar_admin';
            var token = users.ROLES[userrole].apiTOKEN;
             var resp = [];
             var options = {
                 "host": trans_ser,
                 "path": pollapi,
                 "headers": {"Authorization":token}
             };
              logger.info('pollapi---------',pollapi);
             try{
                    var res = https.get(options, function(response){
                       response.on('data', function(text){
                         resp.push(text);
                       });

                       response.on('end', function(){
                          var body = Buffer.concat(resp);
                          // logger.info(body.toString());
                          callback(body);
                       });
                    });

                    res.end();
               }
               catch(e){
                    logger.info('FETCH media details Error');
                    callback(e);
               }
};


var SupportAPI = function () {
};

SupportAPI.prototype.fetcher = fetcher;
SupportAPI.prototype.creator = creator;
SupportAPI.prototype.remover = remover;
SupportAPI.prototype.mediauploader = mediauploader;
SupportAPI.prototype.mediapoller = mediapoller;
module.exports = SupportAPI;

}
)();
