'use strict';
var https = require('https');
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
logger.log('baseurl-------;'+baseurl);
logger.log('trans_ser----------:'+trans_ser);

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
                    console.log('FETCH Error');
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
                         //console.log("Body "+body.toString());
                         callback(body);
                     });
               });

               res.write(JSON.stringify(reqbody));
               res.end();
        }
        catch(e){
            console.log('CREATION Error');
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
                 // console.log(body.toString());
                 callback(body);
              });
            });

           res.end();

        }
        catch(e){
           console.log('DELETION Error');
           callback(e);
        }
};

/**
*  Reusable method to submit a file for transcoding
*
*  file as /../assets/file.format
*
**/
var mediauploader = function(role,afile, callback) {
  var userrole=role||'blippar_admin';
  var token = users.ROLES[userrole].apiTOKEN;
     var transpath = "/api/v1/transcoder/jobs";
     var formData = {
             input_file: fs.createReadStream(__dirname + afile)
          };
     var options = {
      "method": "POST",
      "hostname": trans_ser,
      "path": transpath,
      "headers": {
             "Authorization": token, "cache-control": "no-cache"  },
      "form-data": formData
    };

    try{
            var res = https.request(options, function (response) {
            var resp = [];

            response.on("data", function (text) {
              resp.push(text);
            });

            response.on("end", function () {
              var body = Buffer.concat(resp);
              console.log(body.toString());
              callback(body);
            });
          });
      res.end();
    }catch(e){
       console.log('UPLOAD ERROR');
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

             try{
                    var res = https.get(options, function(response){
                       response.on('data', function(text){
                         resp.push(text);
                       });

                       response.on('end', function(){
                          var body = Buffer.concat(resp);
                          // console.log(body.toString());
                          callback(body);
                       });
                    });

                    res.end();
               }
               catch(e){
                    console.log('FETCH media details Error');
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
