'use strict';
var request = require('request');
var fs = require('fs');
var token ='testingblipparapionly-forQE';
var baseurl = 'https://sf-qa-api.dev.blippar.com';
var trans_ser = 'https://sf-mediacoder.dev.blippar.com/api/v1/transcoder/jobs';
var headers = {'Authorization': 'testingblipparapionly-forQE' };

var resp;

/** Generic reusable fetch method.
 *
 * api parameter to be passed.
 * Eg: /api/group/:groupid as '/api/group/7'
 **/
var fetcher = function(api) {

         var options = {
                 method: 'GET',
                 url: baseurl+api,
                 headers: headers
             };

         request(options, function(error,response, body){
                console.log('Fetched :' + body);
                 resp = body;
                 return resp;
          });
 };

/** Generic reusable POST method.
 *
 * createapi parameter to be passed.
 * Eg:
 *  1. For Campaign creation 'api/group/:groupId/campaign' as 'api/group/7335/campaign
 *  2. For Blipp creatoon '/api/campaign/:campaignId/blipp' as '/api/campaign/81245/blipp' with body
 *  3. For Group creation '/api/group' as '/api/group' with body
 **/
 var creator = function(createapi, body) {

        var options = {
                method : 'POST',
                url : baseurl+createapi,
                headers : {'Authorization': token},
                json: body
        };

        request(options, function(error, response, body){
                console.log('Created > ', body);
        });
};

 /** Generic reusable method.
  *
  * deleteapi parameter to be passed.
  * Eg:
  *  1. For Project Deletion '/api/campaign/:campaignId' as '/api/campaign/81251'
  *  2. For Blipp Deletion '/api/blipp/:blippId' as '/api/blipp/130737'
  *  3. For Group Deleteion '/api/group/7407'' as '/api/group' with body
  **/
var remover = function(deleteapi) {

        var options = {
                method : 'DELETE',
                url : baseurl+deleteapi,
                headers : {'Authorization': token}
        };

        request(options, function(error, response, body){
               console.log('Deleted  > ', body);
        });
};

/**
 *  Reusable method to submit a file for transcoding
 *
 *  file as /../assets/file.format
 *
 **/
var mediacoder = function(afile) {

    var formData = {
        input_file: fs.createReadStream(__dirname + afile)
     };

     var options = {
         method : 'POST',
         url : trans_ser,
         headers : {'Authorization': 'CT6QADgYxqIR6g6CNrAKF0Xx4CN0Xd'},
         formData: formData
     };

     request(options, function(err, response, body) {
       if (err) {
           return console.error('upload failed:', err);
       }
       console.log('Upload successful!  Server responded with:', body);
     });
};

var mediapoller = function(transapi) {
      var options = {
           method: 'GET',
           url: trans_ser+transapi,
           headers: {'Authorization': 'CT6QADgYxqIR6g6CNrAKF0Xx4CN0Xd'}
      };

      request(options, function(error,response, body){
          console.log('Mediacoder job details :' + body);
          resp = body;
          return resp;
      });
};





var CoreAPI = function () {
};

CoreAPI.prototype.fetcher = fetcher;
CoreAPI.prototype.creator = creator;
CoreAPI.prototype.remover = remover;
CoreAPI.prototype.mediacoder = mediacoder;
CoreAPI.prototype.mediapoller = mediapoller;
module.exports = CoreAPI;
