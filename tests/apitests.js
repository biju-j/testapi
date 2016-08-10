'use strict';
var mocha = require('mocha');
var CoreAPI = require('../tests/coreapi');

var chai   = require( 'chai' );
var expect = chai.expect;
var now = new Date();
var coreapi = new CoreAPI();
var figlet = require("figlet");

describe(' GROUP, USER, PROJECTS, BLIPP, MEDIA, PERMISSIONS and MEDIACODER ', function(){
           this.timeout(200000);
            figlet.text("API Tests", function(error, data) {
               if (error)
                 console.error(error);
               else
                 console.log(data);
             });

           it('All Groups fetch', function(done){
                     coreapi.fetcher('/groups', function(text){
                     // console.log('All >'+text);
                     expect( text ).to.contain("Id", "Name", "OwnedByUserId", "Type", "CampaignCount");
                     done();
                 });

            });

           it('Group 7 Status fetch', function(done){
                     coreapi.fetcher('/group/7/status', function(text){
                     // console.log("Test >"+text);
                     expect(text).to.contain("Id", "Name", "Key");
                     done();
                });
            });


           it('Group 7 Details fetch', function(done){
                      coreapi.fetcher('/group/7/details', function(text){
                      expect(text).to.contain("Id", "LicenseType", "AccountManager");
                      done();
               });
            });


           it('Group 0 Details fetch - EXPECTED FAILURE(Negative test)', function(done){
                    coreapi.fetcher('/group/0/details', function(text){
                    // console.log('Group 0 >'+text);
                    expect(text).to.not.contain("AssociatedError");
                    done();
               });
            });


           it('Group 7 Projects count', function(done){
                     coreapi.fetcher('/group/7/campaigns/count', function(text){
                     // console.log('Group 7 Projects count> '+text);
                     expect(Number(text)).to.be.a('number');
                     done();
                });
            });

           it('Group Types', function(done){
                      coreapi.fetcher('/grouptypes', function(text){
                      expect(text).to.contain("Name", "OwnedByUserId");
                      done();
                 });
             });

           it('Group Statuses', function(done){
                      coreapi.fetcher('/groupstatuses', function(text){
                      expect(text).to.contain("Pending", "Active", "Expired", "Cancelled", "Deleted", "Draft");
                      done();
                  });
              });


           it('Total Projects fetch', function(done){
                      coreapi.fetcher('/campaigns/count', function(text){
                      console.log('Total projects >'+Number(text));
                      expect(Number(text)).to.be.a('number');
                      done();
                 });
            });


           it('Total Projects of a Group', function(done){
                      coreapi.fetcher('/group/7/campaigns/count', function(text){
                      console.log('Total projects of the Group> '+Number(text));
                      expect(Number(text)).to.be.a('number');
                      done();
                 });
            });


           it('Total Projects of a user', function(done){
                     coreapi.fetcher('/user/2962/campaigns/count', function(text){
                     console.log('Total projects of user >'+Number(text));
                     expect(Number(text)).to.be.a('number');
                     done();
                 });
            });

           it('All supported Currencies', function(done){
                     coreapi.fetcher('/currencies', function(text){
                     // console.log('Supported Currencies >'+text);
                     expect(text).to.contain("Pound", "Euro", "US Dollar");
                     done();
                });
           });

           it('Group details by id', function(done){
                    coreapi.fetcher('/group/7', function(text){
                    expect(text).to.contain("Name", "OwnedByUserId", "PublishedBlippsCount", "CountryId");
                    done();
                });
           });

           it('All Users', function(done){
                    coreapi.fetcher('/users', function(text){
                    // console.log("All users > "+text);
                    expect(text).to.contain("Email", "Groups", "Roles", "Status", "Campaigns");
                    done();
                 });
           });

           it('Permissions of a User', function(done){
                   coreapi.fetcher('/user/6411/permissions', function(text){
                   // console.log("Permissions of user > "+text);
                   expect(text).to.contain("Permission", "Caller", "Action");
                   done();
                });
           });

           it('Fetch Current User', function(done){
                  coreapi.fetcher('/user', function(text){
                  // console.log("Current user > "+text);
                  expect(text).to.contain("Email", "CreatedAt", "CreatedByUserId", "StatusId");
                  done();
                });
           });

           it('User check', function(done){
                   coreapi.fetcher('/user/6411', function(text){
                   // console.log("Check user > "+text);
                   expect(text).to.contain("Email", "CreatedAt", "CreatedByUserId", "StatusId");
                   done();
                 });
           });

           it('Existent Email check', function(done){
                   coreapi.fetcher('/email/exists/bijupja.na@gmail.com', function(text){
                   expect(text.trim()).to.equal("true");
                   done();
                 });
           });

           it('Non-existent Email check', function(done){
                      coreapi.fetcher('/email/exists/simple@gmail.com', function(text){
                      expect(text.trim()).to.equal("false");
                      done();
                  });
           });


           it('User Status', function(done){
                   coreapi.fetcher('/user/6411/status', function(text){
                   // console.log("Existent USER Status > "+text);
                   expect(text).to.contain("Id", "Name", "Description");
                   done();
                 });
           });

           it('Non-existent User Status - EXPECTED FAILURE(Negative test)', function(done){
                    coreapi.fetcher('/user/0/status', function(text){
                    // console.log("Non-existent USER's Status > "+text);
                    expect(text).to.not.contain("AssociatedError");
                    done();
                });
           });

           it('User Projects', function(done){
                     coreapi.fetcher('/user/6411/campaigns', function(text){
                     // console.log("User Projects > "+text);
                     expect(text).to.contain("GroupId", "CreatedByUserId", "PublishDate");
                     done();
                  });
           });

           it('User Campaigns Count', function(done){
                     coreapi.fetcher('/user/6411/campaigns/count', function(text){
                     // console.log("Campaign Count of user > "+text);
                     expect( Number(text) ).to.be.a('number');
                     done();
                   });
            });


           it('User Roles', function(done){
                     coreapi.fetcher('/userroles', function(text){
                     // console.log("USER ROLES > "+text);
                     expect(text).to.contain("normal_user", "blippar_user", "group_admin", "blippar_admin", "root_admin", "ad_user", "signup_user", "testing_signup_user", "blippbuilder_flash_user", "blippbuilder_javascript_user", "bespoke_blippbasic_user", "bespoke_javascript_user", "external_developer");
                     done();
                   });
            });


           it('User Statuses', function(done){
                    coreapi.fetcher('/userstatuses', function(text){
                    // console.log("USER STATUSES > "+text);
                    expect(text).to.contain("Draft", "Pending", "Active", "Deleted", "reset_password");
                    done();
                  });
            });

           it('PROJECTS ', function(done){
                    coreapi.fetcher('/campaigns', function(text){
                    // console.log("PROJECTS  > "+text);
                    expect(text).to.contain("CreatedAt", "CreatedByUserId", "PublishDate");
                    done();
                 });
            });


           it('PROJECTS Count ', function(done){
                    coreapi.fetcher('/campaigns/count', function(text){
                    console.log("PROJECTS Count > "+Number(text) );
                    expect(Number(text) ).to.be.a('number');
                    done();
                  });
             });

           it('STANDARD supported Medias fetch', function(done){
                     coreapi.fetcher('/medias/standard', function(text){
                     // console.log("Standard Supported medias  > "+text);
                     expect(text).to.contain("MimeType", "MediaUrlMap", "thumbnail", "ShaHash");
                     done();
                  });
             });

           it('Specific User supported Medias fetch', function(done){
                      coreapi.fetcher('/user/6411/medias', function(text){
                      // console.log("User's medias > "+text);
                      expect(text).to.not.have.length( 0 );
                      done();
                  });
             });

           it('User\'s Media favourites', function(done){
                     coreapi.fetcher('/user/6411/medias/favorites', function(text){
                     // console.log("USER's MEDIA FAVOURITES > "+text);
                     expect(text).to.not.have.length( 0 );
                     done();
                  });
             });

           it('All Countries fetch', function(done){
                       coreapi.fetcher('/countries', function(text){
                       // console.log("Countries  > "+text);
                       expect(text).to.contain("India", "US","Argentina", "NeedZipCode", "IsoCode");
                       done();
                    });
             });

           it('All Services fetch - EXPECTED FAILURE(CheckPermissions Fn20)', function(done){     // PERMISSIONS ERROR CheckPermissions Fn20
                     coreapi.fetcher('/services', function(text){
                     // console.log("ALL SERVICES  > "+text);
                     expect(text).to.not.contain("AssociatedError");
                     done();
                  });
             });

           it('All Functions fetch - EXPECTED FAILURE(CheckPermissions Fn22)', function(done){
                     coreapi.fetcher('/functions', function(text){    // PERMISSIONS ERROR CheckPermissions Fn22
                     // console.log("ALL FUNCTIONS  > "+text);
                     expect(text).to.not.contain("AssociatedError");
                     done();
                  });
             });


             it('Create a new Project', function(done){

                  var projName = "APIProj_"+now.getTime();
                  var projbody = { "Name": projName,
                                  "Description":"Test Proj creation from API"
                   }
                        coreapi.creator('/group/7335/campaign', projbody, function(text) {
                        // console.log('Created Project from API> '+text);
                        expect(text).to.contain("CreatedAt", "CreatedByUserId");
                        done();
                  });
           });

           it('Create a new Blipp', function(done){
                 var blippName = "Blipp_"+now.getTime();
                 var blippbody = {"Name" : blippName, "Description":"Test Blipp creation from API", "BlippTypeId" :3}
                 coreapi.creator('/campaign/82162/blipp',blippbody, function(text) {
                     // console.log('Created Blipp '+text);
                     expect(text).to.contain("CreatedAt", "CreatedByUserId");
                     done();
                });
           });

           it('Create a new Group', function(done){
                 var groupName = "TestGrp_"+now.getTime();
                 var groupbody = {"Name" : groupName}
                 coreapi.creator('/group',groupbody, function(text) {
                     // console.log('Created Group '+text);
                     expect(text).to.contain("CreatedByUserId", "CreatedAt");
                     done();
                 });
           });

           it('PUB-13 hasStats=1 for a published Project(Pepsi)', function(done) {
                 coreapi.fetcher('/campaign/2080/blipps?has_stats=1', function(text){
                     expect(text).to.contain( "Features", "HasStats" );
                     done();
                 });
           });

           it('PUB-13 hasStats=0 for a published Project(Tinkle)', function(done) {

                 coreapi.fetcher('/campaign/13793/blipps?has_stats=0', function(text){
                     // console.log("HasStats with FEATURES > "+text);
                     expect(text).to.not.contain("HasStats");
                     expect(text).to.have.length( 3 );
                     done();
                 });
            });

           it('PUB-13 hasStats=0 for a Project(Pepsi)', function(done) {

                  coreapi.fetcher('/campaign/2080/blipps?has_stats=false', function(text){
                      // console.log("HasStats with FEATURES > "+text);
                      expect(text).to.not.contain("HasStats");
                      expect(text).to.have.length( 3 );
                      done();
                  });
           });

           it('PUB-13 hasStats=true for a Project(General Mills)', function(done) {

                 coreapi.fetcher('/campaign/12077/blipps?has_stats=true', function(text){
                      // console.log("HasStats with FEATURES > "+text);
                       expect(text).to.contain( "Features", "HasStats" );
                      done();
                 });
           });


           /* it('Delete a Project', function(done){
                  var delresp = ' ';
                  coreapi.remover('/campaign/81952', function(text) {
                          delresp += text;
                          //expect(groupresp).to.have.all.keys("BlippId", "CreatedAt");
                          done();
                  });
            });

           it('Upload to MediaCoder', function(done){
                  var mediaresp = ' ';
                  coreapi.mediauploader('/../assets/test1.mov', function(text) {
                        mediaresp += text;
                    //expect(groupresp).to.have.all.keys("BlippId", "CreatedAt");
                  done();
                });
           }); */


           it('Media job details', function(done){

                  coreapi.mediapoller('/api/v1/transcoder/jobs/1470381054000-m9gg5i', function(text) {
                      // console.log('Media job details'+text);
                      expect(text).to.contain("blipp_media_preset", "SUBMITTED", "THUMBS_CREATED", "PROGRESSING", "COMPLETED");
                      done();
                  });
           });

});

