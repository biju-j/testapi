'use strict';
var mocha = require('mocha');
var SupportAPI = require('../lib/support.js');
var logging      = require( '../config/config-log4js.js' );
var fs = require('fs');
var logger=logging.LOG;
var chai   = require( 'chai' );
var expect = chai.expect;
var now = new Date();
var supportapi = new SupportAPI();
var bRole='blippar_admin';
var projt,bid,mid;

describe(' Project Blipp Marker creation Tests', function(){
           this.timeout(200000);

          it('Create a new Project', function(done){
                        var projName = "anAPI_"+now.getTime();
                        var projbody = { "Name": projName,
                                         "Description":"Test Proj created from API"
                             }
                        supportapi.creator(bRole,'/group/7677/campaign', projbody, function(proj) {

                               projt = JSON.parse(proj);
                               logger.info("Project Created and ProjId is>>>"+projt.Id);
                               global.projid = projt.Id;
                               logger.info("Proj Created and global projt.Id >>>"+projid);
                               done();
                        });
           });

           it('Create a new Blipp', function(done){
                         var bapi = "/campaign/"+projid+"/blipp";
                         var blippName = "ablipp_"+now.getTime();
                         var blippbody = {"Name" : blippName, "Description":"Test Blipp created from API", "BlippTypeId" :3}
                         supportapi.creator(bRole,bapi,blippbody, function(blipp) {
                         bid = JSON.parse(blipp);
                         global.blippid = bid.Id;
                         logger.info("Blipp Created and global blippid>>>"+blippid);
                         done();
             });

          });

         it('Create a Marker and assign to blipp create prior', function(done){

          logger.info("Created BlippId is>>>"+blippid);
                       supportapi.createmarker(bRole, blippid, '/../resources/assets/NASA.jpeg', function(marker) {
                            // logger.info('Marker too created'+marker);
                             mid = JSON.parse(marker);
                             global.markerid = mid.Id;
                             logger.info("Marker Created and global markerid>>>"+markerid);
                             done();
                       });
           });
});



