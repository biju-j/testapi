'use strict';
var mocha = require('mocha');
var SupportAPI = require('../lib/support.js');
var logging      = require( '../config/config-log4js.js' );
var logger=logging.LOG;

var chai   = require( 'chai' );
var expect = chai.expect;
var now = new Date();
var supportapi = new SupportAPI();

var bRole='blippar_admin';
describe(' GROUP and other generic Tests', function(){
           this.timeout(200000);
           it('All Groups fetch', function(done){
                     supportapi.fetcher(bRole,'/groups', function(text){
                     // logger.info('All >'+text);
                     logger.info('All Groups fetch');
                     expect( text ).to.contain("Id", "Name", "OwnedByUserId", "Type", "CampaignCount");
                     done();
                 });

            });

           it('Group 7 Status fetch', function(done){
                     supportapi.fetcher(bRole,'/group/7/status', function(text){
                     // logger.info("Test >"+text);
                     logger.info('Group 7 Status fetch');
                     expect(text).to.contain("Id", "Name", "Key");
                     done();
                });
            });


           it('Group 7 Details fetch', function(done){
                      supportapi.fetcher(bRole,'/group/7/details', function(text){
                      expect(text).to.contain("Id", "LicenseType", "AccountManager");
                      done();
               });
            });


           it.skip('Group 0 Details fetch - EXPECTED FAILURE(Negative test)', function(done){
                    supportapi.fetcher(bRole,'/group/0/details', function(text){
                    // logger.info('Group 0 >'+text);
                    expect(text).to.not.contain("AssociatedError");
                    done();
               });
            });


           it('Group 7 Projects count', function(done){
                     supportapi.fetcher(bRole,'/group/7/campaigns/count', function(text){
                     // logger.info('Group 7 Projects count> '+text);
                     expect(Number(text)).to.be.a('number');
                     done();
                });
            });

           it('Group Types', function(done){
                      supportapi.fetcher(bRole,'/grouptypes', function(text){
                      expect(text).to.contain("Name", "OwnedByUserId");
                      done();
                 });
             });

           it('Group Statuses', function(done){
                      supportapi.fetcher(bRole,'/groupstatuses', function(text){
                      expect(text).to.contain("Pending", "Active", "Expired", "Cancelled", "Deleted", "Draft");
                      done();
                  });
              });


           it('Total Projects fetch', function(done){
                      supportapi.fetcher(bRole,'/campaigns/count', function(text){
                      logger.info('Total projects >'+Number(text));
                      expect(Number(text)).to.be.a('number');
                      done();
                 });
            });


           it('Total Projects of a Group', function(done){
                      supportapi.fetcher(bRole,'/group/7/campaigns/count', function(text){
                      logger.info('Total projects of the Group> '+Number(text));
                      expect(Number(text)).to.be.a('number');
                      done();
                 });
            });


           it('Total Projects of a user', function(done){
                     supportapi.fetcher(bRole,'/user/2962/campaigns/count', function(text){
                     logger.info('Total projects of user >'+Number(text));
                     expect(Number(text)).to.be.a('number');
                     done();
                 });
            });

           it('All supported Currencies', function(done){
                     supportapi.fetcher(bRole,'/currencies', function(text){
                     // logger.info('Supported Currencies >'+text);
                     expect(text).to.contain("Pound", "Euro", "US Dollar");
                     done();
                });
           });

           it('Group details by id', function(done){
                    supportapi.fetcher(bRole,'/group/7', function(text){
                    expect(text).to.contain("Name", "OwnedByUserId", "PublishedBlippsCount", "CountryId");
                    done();
                });
           });

           it('PROJECTS ', function(done){
                    supportapi.fetcher(bRole,'/campaigns', function(text){
                    // logger.info("PROJECTS  > "+text);
                    expect(text).to.contain("CreatedAt", "CreatedByUserId", "PublishDate");
                    done();
                 });
            });


           it('PROJECTS Count ', function(done){
                    supportapi.fetcher(bRole,'/campaigns/count', function(text){
                    logger.info("PROJECTS Count > "+Number(text));
                    expect(Number(text) ).to.be.a('number');
                    done();
                  });
             });

           it('STANDARD supported Medias fetch', function(done){
                     supportapi.fetcher(bRole,'/medias/standard', function(text){
                     // logger.info("Standard Supported medias  > "+text);
                     expect(text).to.contain("MimeType", "MediaUrlMap", "thumbnail", "ShaHash");
                     done();
                  });
             });


           it('All Countries fetch', function(done){
                       supportapi.fetcher(bRole,'/countries', function(text){
                       // logger.info("Countries  > "+text);
                       expect(text).to.contain("India", "US","Argentina", "NeedZipCode", "IsoCode");
                       done();
                    });
             });

           it.skip('All Services fetch - EXPECTED FAILURE(CheckPermissions Fn20)', function(done){     // PERMISSIONS ERROR CheckPermissions Fn20
                     supportapi.fetcher(bRole,'/services', function(text){
                     // logger.info("ALL SERVICES  > "+text);
                     expect(text).to.not.contain("AssociatedError");
                     done();
                  });
             });

           it.skip('All Functions fetch - EXPECTED FAILURE(CheckPermissions Fn22)', function(done){
                     supportapi.fetcher(bRole,'/functions', function(text){    // PERMISSIONS ERROR CheckPermissions Fn22
                     // logger.info("ALL FUNCTIONS  > "+text);
                     expect(text).to.not.contain("AssociatedError");
                     done();
                  });
             });


             it('Create a new Project', function(done){

                  var projName = "APIProj_"+now.getTime();
                  var projbody = { "Name": projName,
                                  "Description":"Test Proj creation from API"
                   }
                        supportapi.creator(bRole,'/group/7335/campaign', projbody, function(text) {
                        // logger.info('Created Project from API> '+text);
                        expect(text).to.contain("CreatedAt", "CreatedByUserId");
                        done();
                  });
           });

           it('Create a new Group', function(done){
                 var groupName = "TestGrp_"+now.getTime();
                 var groupbody = {"Name" : groupName}
                 supportapi.creator(bRole,'/group',groupbody,function(text) {
                     // logger.info('Created Group '+text);
                     expect(text).to.contain("CreatedByUserId", "CreatedAt");
                     done();
                 });
           });

           it('PUB-13 hasStats=1 for a published Project(Pepsi)', function(done) {
                 supportapi.fetcher(bRole,'/campaign/2080/blipps?has_stats=1', function(text){
                     expect(text).to.contain( "Features", "HasStats" );
                     done();
                 });
           });

           it('PUB-13 hasStats=0 for a published Project(Tinkle)', function(done) {

                 supportapi.fetcher(bRole,'/campaign/13793/blipps?has_stats=0', function(text){
                     // logger.info("HasStats with FEATURES > "+text);
                     expect(text).to.not.contain("HasStats");
                     expect(text).to.have.length( 3 );
                     done();
                 });
            });

           it('PUB-13 hasStats=0 for a Project(Pepsi)', function(done) {

                  supportapi.fetcher(bRole,'/campaign/2080/blipps?has_stats=false', function(text){
                      // logger.info("HasStats with FEATURES > "+text);
                      expect(text).to.not.contain("HasStats");
                      expect(text).to.have.length( 3 );
                      done();
                  });
           });

           it('PUB-13 hasStats=true for a Project(General Mills)', function(done) {

                 supportapi.fetcher(bRole,'/campaign/12077/blipps?has_stats=true', function(text){
                      // logger.info("HasStats with FEATURES > "+text);
                       expect(text).to.contain( "Features", "HasStats" );
                      done();
                 });
           });


           /*it('Delete a Project', function(done){
                  var delresp = ' ';
                  supportapi.remover('/campaign/81952', function(text) {
                          delresp += text;
                          //expect(groupresp).to.have.all.keys("BlippId", "CreatedAt");
                          done();
                  });
            });
           */



});
