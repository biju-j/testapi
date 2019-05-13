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

logger.info('baseurl-------'+baseurl);

/** Generic reusable fetch method.
*
* fetchapi parameter to be passed.
* Eg: /group/:groupid as '/group/7'
**/
var fetcher = function(role,fetchapi,callback) {
             var resp = '';
             var userrole=role||'check_admin';
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
*  1. For Entitycreatoon '/project/:projectId/proj' as '/campaign/81245/simple' with body
*  2. For Group creation '/group' as '/group' with body
**/
var creator = function(role,createapi, reqbody, callback) {
        var resp = '';
        var userrole=role||'check_admin';
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
*  2. For Group Deleteion '/group/7407'' as '/group' with body  - Permission Error with Token 
**/
var remover = function(role,deleteapi,callback) {

        var userrole=role||'check_admin';
        var token = users.ROLES[userrole].apiTOKEN;
        var options = {
            method: "DELETE",
            url: "https://"+baseurl+"/api"+deleteapi,
            headers: { "Authorization": token, "cache-control": "no-cache"  }
        };

        request(options, function(err, response, body) {
                 if (err)
                    callback(err);
                 callback(body);
        });
};

/** Generic reusable method.
*
*
* to delete all projects created by a user - userid to be passed
*
**/

var removeall = function(role, userid,callback) {
        var allprojs = '/user/'+userid+'/campaigns?orderby=created_at__desc&limit=1000';
        fetcher(role, allprojs, function(allproj){
               var projects = JSON.parse(allproj);
               logger.info("Total Projects> "+projects.length);
               projects.forEach( function(project,done){
                     if(project.Deleted == 0){
                             var delproj = '/campaign/'+project.Id;
                             logger.info("Project being deleted <"+project.Name+"> having id <"+project.Id+">");
                             remover(role, delproj, function(resp){
                             logger.info("Deleting......"+delproj);
                                  logger.info(project.Id+" DELETED Successfully..."+resp);
                             });
                     }
               });
        });
};


/** Generic reusable method.
*
* updateapi parameter to be passed.
* Eg:
*  1. For Project updation '/campaign/:campaignId' as '/campaign/81251'
*     with udata as { 'Name':'updatedprojname', 'Description':'updateddesc' }
*
*
**/
var updater = function(role,updateapi,udata, callback) {

        var userrole=role||'check_admin';
        var token = users.ROLES[userrole].apiTOKEN;
        var options = {
          method: "PATCH",
          url: "https://"+baseurl+"/api"+updateapi,
          headers:
           { "Authorization": token, "cache-control": "no-cache"},
          body: JSON.stringify(udata)

          }
        request(options, function (error, response, body) {
          if (error)
               callback(error);
          callback(body);
        });
};





var SupportAPI = function () {
};

SupportAPI.prototype.fetcher = fetcher;
SupportAPI.prototype.creator = creator;
SupportAPI.prototype.remover = remover;
SupportAPI.prototype.updater = updater;
SupportAPI.prototype.removeall = removeall;

module.exports = SupportAPI;

}
)();
