'use strict';
var mocha = require('mocha');
var SupportAPI = require('../lib/support.js');
var logging      = require( '../config/config-log4js.js' );
var fs = require('fs');
var logger=logging.LOG;
var chai   = require( 'chai' );
var figlet = require("figlet");
var expect = chai.expect;
var now = new Date();
var supportapi = new SupportAPI();
var bRole='blippar_admin';

before(function(done) {
             this.timeout(20000000);
             figlet.text("API Tests", function(error, data) {
               if (error)
                 logger.error(error);
               else
                 logger.info(data);
             });


                  var projName = "TestAPI_"+now.getTime();
                  var projbody = { "Name": projName,
                                   "Description":"Test Proj created from API"
                                 }
                  supportapi.creator(bRole,'/group/7677/campaign', projbody, function(proj) {
                        var projt = JSON.parse(proj);
                        global.projid = function(){ return projt.Id; };
                        logger.info("Proj Created and global projt.Id >> "+projid());

                  var basicName = "Bespoke_"+now.getTime();
                  var basicbody = {"Name" : basicName, "Description":"Test Blipp created from API", "BlippTypeId" :1}  //3 is for blippbuilder v2
                  supportapi.creator(bRole,"/campaign/"+projid()+"/blipp",basicbody, function(blipp) {
                          var bid = JSON.parse(blipp);
                          global.bespokeid = function(){ return bid.Id; };
                          logger.info("Blipp Bespoke Created and global bespokeid >>> "+bespokeid());

                  });

                  var bbcname = "BBClassic_"+now.getTime();
                  var bbcbody = {"Name" : bbcname, "Description":"Test Blipp created from API", "BlippTypeId" :3}  //3 is for blippbuilder v2
                  supportapi.creator(bRole,"/campaign/"+projid()+"/blipp",bbcbody, function(bbasic) {
                          var bid = JSON.parse(bbasic);
                          global.bbclassicid = function(){ return  bid.Id; };
                          logger.info("Blipp Basic Classic and global bbasicid >>> "+bbclassicid());

                  });

                  var apijsname = "BlippAPI_"+now.getTime();


                  logger.info("Proj Created and global projid2 >>.. "+projid());
                  supportapi.createjsblipp(bRole, projid(), apijsname,  function(jbody) {
                            var apid1 = JSON.parse(jbody);
                            global.jsapid = function(){ return apid1.Id; };
                            logger.info("JS blipp id >>> "+apid1.Id);
                            logger.info("JS blipp Created and global blippid >>> "+jsapid());
                            done();
                  });
                });

                global.searchprojName = function(){ return "Del"+now.getTime(); };
                var searchprojbody = { "Name": searchprojName(), "Description":"Test Proj created from API" }

                supportapi.creator(bRole,'/group/7677/campaign', searchprojbody, function(sproj) {
                var pid = JSON.parse(sproj);
                global.searchprojid = function(){ return pid.Id; };
                logger.info("Proj to be SEARCHED Created and is >> "+searchprojid());

           });
});
describe(' BLIPP Creation Tests in a Project - BESPOKE, BBCLASSIC version, plist, BLIPP API jsversion, publish - country IN', function(){
           this.timeout(20000000);

           it('Create a new Bespoke Blipp Version ',function(done){
                     logger.info("Creating a New Bespoke Version for blipp having id>> "+bespokeid());
                     supportapi.createversion(bRole, bespokeid(), 'bespoke_country','/../resources/assets/Bespoke.zip', function(resp){
                     // logger.info("Bespoke Blipp Version created and response is>>>"+resp);
                     expect(resp).to.contain("Version", "Status");
                      done();
                  });
           });

           it('Create and attach a Marker ',function(done){
                    logger.info("Creating a Marker for Bespoke >> "+bbclassicid());
                    supportapi.createmarker(bRole, bbclassicid(), '/../resources/assets/NASA.jpeg', function(resp){
                    expect(resp).to.contain("PROCESSING", "NASA.jpeg");
                    done();
                  });
           });


           it('Create Blipp Builder(Classic) Version and plist',function(done){
                          logger.info("Creating Blipp Builder(Classic) Version  >> "+bbclassicid());
                          supportapi.createversion(bRole, bbclassicid(), 'builder_v2', ' ', function(resp){
                          // logger.info("Blipp Version created and response is>>>"+resp);
                          var vid = JSON.parse(resp);
                          global.bbclasssverid = function(){ return vid.Id};
                          logger.info("Creating plist for BB Classic having versionid> "+bbclasssverid());
                          supportapi.createplist(bRole, bbclassicid(), bbclasssverid(), function(presp){
                          expect(presp).to.contain("MD5", "BlippHash");
                          var plistresp = JSON.parse(presp);
                          global.plistid = function(){ return plistresp.Id; };
                          expect(plistid()).to.not.be.undefined;
                          expect(plistid()).to.be.a('Number');
                          done();
                     });
                 });
           });

           it('Create and attach a Marker onto a JS API ',function(done){
                          logger.info("Creating a Marker for jsapiblippid  >> "+jsapid());
                          supportapi.createmarker(bRole, jsapid(), '/../resources/assets/NASA.jpeg', function(resp){
                               var markerinfo = JSON.parse(resp);
                               global.markerid = function(){ return markerinfo.Id; };
                               logger.info("Marker created is>>>"+markerid());
                               expect(markerid()).to.not.be.undefined;
                               expect(markerid()).to.be.a('Number');
                               done();
                          });
           });

           it('Create a JS Blipp initial Version ',function(done){
                          logger.info("Creating Blipp API Version  >> "+jsapid());
                          supportapi.createversion(bRole, jsapid(), 'blipp_api1', ' ', function(resp){
                               //logger.info("Blipp Version created and response is>>>"+resp);
                               var vid = JSON.parse(resp);
                               global.jsinitversionid = function(){ return vid.Id; };
                               logger.info("Blipp Version created and response is>>>"+jsinitversionid());
                               expect(jsinitversionid()).to.not.be.undefined;
                               expect(jsinitversionid()).to.be.a('Number');
                               done();
                           });
           });

           it('Create a customJS Version ',function(done){
                          logger.info("Creating a new JS Blipp Version >> "+jsapid());
                          supportapi.createversion(bRole, jsapid(), 'blipp_api2','/../resources/assets/testjs2.zip', function(resp){
                             var customversion = JSON.parse(resp);
                             global.customversionid = function(){ return customversion.Id; };
                             logger.info("JS Version created and response is>>>"+customversionid());
                             expect(customversionid()).to.not.be.undefined;
                             expect(customversionid()).to.be.a('Number');
                             done();
                        });
           });

           it('PUBLISH JS BLIPP',function(done){
                        logger.info("Publish JS API blipp <<"+jsapid()+">> having Version id <<"+ jsinitversionid()+"<<");
                        supportapi.publishjsblipp(bRole,jsapid(), jsinitversionid(), 'IN', function(text){
                             var jspublishversion = JSON.parse(text);
                             global.jspublishid = function(){ return jspublishversion.Id; };
                             logger.info('PUBLISING Response> '+jspublishid());
                             expect(jspublishid()).to.not.be.undefined;
                             expect(jspublishid()).to.be.a('Number');
                             done();
                        });
           });



           it('Fetch Blipp details using plistid for plist created', function(done){
                     logger.info("Fetching Blipp details using plist >> "+plistid());
                      supportapi.fetcher(bRole,'/plist/'+plistid()+'/blipp', function(text){
                          expect(text).to.contain("CheckPermissions Fn343");     // Permissions Error, thus Expected Error
                          done();
                      });

           });

           it('Fetch Cover of Project created', function(done){
                   supportapi.fetcher(bRole,'/campaign/'+projid()+'/cover', function(text){
                       expect(text).to.contain("markers");
                       done();
                   });
           });

           it('Fetch Markers of Project created', function(done){
                   supportapi.fetcher(bRole,'/campaign/'+projid()+'/lastmarkers', function(text){
                   expect(text).to.contain("NASA.jpeg","m1.jpeg");
                   done();
                  });
           });

           it('Fetch Cover of BB Classic blipp created', function(done){
                   supportapi.fetcher(bRole,'/blipp/'+bbclassicid()+'/markers', function(text){
                   expect(text).to.contain("NASA.jpeg");
                   done();
                });
           });

           it('Fetch Blipps of Project created', function(done){
                     supportapi.fetcher(bRole,'/campaign/'+projid()+'/blipps', function(text){
                     expect(text).to.contain(projid(),"Test Blipp created from API");
                     done();
                  });
           });

           it('Searching a project ', function(done){
                     logger.info("Searching a project named> "+searchprojName()+" with id>"+searchprojid());

                     const allprojs = '/campaigns?orderby=created_at__desc&limit=1000';
                     supportapi.fetcher(bRole, allprojs, function(allproj){

                     var projects = JSON.parse(allproj);
                     projects.map(function(project){
                             if(project.Name.toLowerCase() == searchprojName().toLowerCase() && project.Deleted == 0)
                                  global.foundproj = function(){ return project.Id; };
                             });
                             expect(foundproj()).to.equal(searchprojid());
                             done();
                     });
           });
});
