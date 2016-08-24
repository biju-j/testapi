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
var projt,bid,mid,vid;

describe(' Project, BlippBuilder(Classic) and Version creation tests', function(){
           this.timeout(20000000);

           it('Create a new Project named Test_Stats', function(done){
                        var projName = "Test_Stats_"+now.getTime();
                        var projbody = { "Name": projName,
                                         "Description":"Test Proj created from API"
                             }
                        supportapi.creator(bRole,'/group/7677/campaign', projbody, function(proj) {
                              projt = JSON.parse(proj);
                              logger.info("Project Created and ProjId is>> "+projt.Id);
                              global.projid = projt.Id;
                              logger.info("Proj Created and global projt.Id >> "+projid);
                              done();
                        });
           });


          it('Create a Blipp Builder classic blipp named TestBBC', function(done){

                        var bapi = "/campaign/"+projid+"/blipp";
                        var blippName = "TestBBC"+now.getTime();
                        //3 is for blippbuilder v2
                        var blippbody = {"Name" : blippName, "Description":"Test Blipp created from API", "BlippTypeId" :3}
                            supportapi.creator(bRole,bapi,blippbody, function(blipp) {
                                  bid = JSON.parse(blipp);
                                  global.blippid = bid.Id;
                                  logger.info("Blipp Created and global blippid >>> "+blippid);
                                  done();
                        });

          });

          it('Create and attach a Marker ',function(done){
                        logger.info("Creating a Marker  >> "+blippid);
                        supportapi.createmarker(bRole, blippid, '/../resources/assets/NASA.jpeg', function(resp){
                               logger.info("Marker created is>>>"+resp);
                                done();
                        });
          });

          it('Create a Blipp Builder(Classic) Version ',function(done){
                  logger.info("Creating Blipp Builder(Classic) Version  >> "+blippid);
                  supportapi.createversion(bRole, blippid, 'builder_v2', ' ', function(resp){
                         logger.info("Blipp Version created and response is>>>"+resp);
                          vid = JSON.parse(resp);
                          global.versionid = vid.Id;
                         done();
                  });
          });

          it('Create plist for Blipp Builder Classic', function(next){
                     logger.info("Creating plist for BB Classic having versionid> "+versionid);
                     supportapi.createplist(bRole, blippid, versionid, function(presp){
                            logger.info("Plist response is>>>"+presp);
                            next();
                     });


          });

});

          /*  // Below is Bespoke working, commented as it needs refactoring to remove dependency of common "blippid"
              // If Bespoke tests below is being run, comment out above builder_v2(classic)
          it('Create a new Bespoke blipp named TestBasic', function(done){
                      var bapi = "/campaign/"+projid+"/blipp";
                      var blippName = "TestBBC"+now.getTime();
                      //1 is for Bespoke blipp
                      var blippbody = {"Name" : blippName, "Description":"Test Blipp created from API", "BlippTypeId" :1}
                      supportapi.creator(bRole,bapi,blippbody, function(blipp) {
                                bid = JSON.parse(blipp);
                                global.blippid = bid.Id;
                                logger.info("Blipp Created and global blippid >>> "+blippid);
                                done();
                       });

          });

           it('Create a new Bespoke Blipp Version ',function(done){
                       logger.info("Creating a New Version for a Blipp >> "+blippid);
                       supportapi.createversion(bRole, blippid, 'bespoke_country','/../resources/assets/Bespoke.zip', function(resp){
                             logger.info("Blipp Version created and response is>>>"+resp);
                             done();
                       });
          }); */






