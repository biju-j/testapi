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
var projid,bespokeid,bbclassicid, jsapid, mid,vid;

before(function(done) {
                  this.timeout(20000000);
                  var projName = "ProjAPI_"+now.getTime();
                  var projbody = { "Name": projName,
                                   "Description":"Test Proj created from API"
                                 }
                  supportapi.creator(bRole,'/group/7677/campaign', projbody, function(proj) {
                        var projt = JSON.parse(proj);
                        projid = projt.Id;
                        logger.info("Proj Created and global projt.Id >> "+projid);

                        var basicName = "Bespoke_"+now.getTime();
                        var basicbody = {"Name" : basicName, "Description":"Test Blipp created from API", "BlippTypeId" :1}  //3 is for blippbuilder v2
                      supportapi.creator(bRole,"/campaign/"+projid+"/blipp",basicbody, function(blipp) {
                          var bid = JSON.parse(blipp);
                          bespokeid =  bid.Id;
                          logger.info("Blipp Bespoke Created and global bespokeid >>> "+bespokeid);

                      });

                      var bbcname = "BBClassic_"+now.getTime();
                      var bbcbody = {"Name" : bbcname, "Description":"Test Blipp created from API", "BlippTypeId" :3}  //3 is for blippbuilder v2
                      supportapi.creator(bRole,"/campaign/"+projid+"/blipp",bbcbody, function(bbasic) {
                          var bid = JSON.parse(bbasic);
                          bbclassicid =  bid.Id;
                          logger.info("Blipp Basic Classic and global bbasicid >>> "+bbclassicid);
                          done();
                       });
               });
});

describe(' Project, Bespoke, BlippBuilder(Classic) Version, PList, Markers etc., creation tests', function(){
           this.timeout(20000000);

           it('Create a new Bespoke Blipp Version ',function(done){
                     logger.info("Creating a New Bespoke Version for blipp having id>> "+bespokeid);
                     supportapi.createversion(bRole, bespokeid, 'bespoke_country','/../resources/assets/Bespoke.zip', function(resp){
                     // logger.info("Bespoke Blipp Version created and response is>>>"+resp);
                     expect(resp).to.contain("Version", "Status");
                      done();
                  });
           });

           it('Create and attach a Marker ',function(done){
                    logger.info("Creating a Marker for Bespoke >> "+bbclassicid);
                    supportapi.createmarker(bRole, bbclassicid, '/../resources/assets/NASA.jpeg', function(resp){
                    expect(resp).to.contain("PROCESSING", "NASA.jpeg");
                    done();
                  });
           });


           it('Create Blipp Builder(Classic) Version and plist',function(done){
                          logger.info("Creating Blipp Builder(Classic) Version  >> "+bbclassicid);
                          supportapi.createversion(bRole, bbclassicid, 'builder_v2', ' ', function(resp){
                          // logger.info("Blipp Version created and response is>>>"+resp);
                          vid = JSON.parse(resp);
                          global.versionid = vid.Id;
                          logger.info("Creating plist for BB Classic having versionid> "+versionid);
                          supportapi.createplist(bRole, bbclassicid, versionid, function(presp){
                          expect(presp).to.contain("MD5", "BlippHash");
                          var plistresp = JSON.parse(presp);
                          global.plistid = plistresp.Id;
                          done();
                     });
                 });
           });

           it('Fetch Blipp details using plistid for plist created', function(done){
                     logger.info("Fetching Blipp details using plist >> "+plistid);
                      supportapi.fetcher(bRole,'/plist/'+plistid+'/blipp', function(text){
                          expect(text).to.contain("CheckPermissions Fn343");     // Permissions Error, thus Expected Error
                          done();
                      });

           });

           it('Fetch Cover of Project created', function(done){
                   supportapi.fetcher(bRole,'/campaign/'+projid+'/cover', function(text){
                       expect(text).to.contain("markers");
                       done();
                   });
           });

           it('Fetch Markers of Project created', function(done){
                   supportapi.fetcher(bRole,'/campaign/'+projid+'/lastmarkers', function(text){
                   expect(text).to.contain("NASA.jpeg","m1.jpeg");
                   done();
                  });
           });

           it('Fetch Cover of BB Classic blipp created', function(done){
                   supportapi.fetcher(bRole,'/blipp/'+bbclassicid+'/markers', function(text){
                   expect(text).to.contain("NASA.jpeg");
                   done();
                });
           });

           it('Fetch Blipps of Project created', function(done){
                     supportapi.fetcher(bRole,'/campaign/'+projid+'/blipps', function(text){
                     expect(text).to.contain(projid,"Test Blipp created from API");
                     done();
                  });
           });

});
