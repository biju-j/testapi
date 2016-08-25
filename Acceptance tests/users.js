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
describe(' USERS Tests', function(){
           this.timeout(200000);

           it('All Users', function(done){
                    supportapi.fetcher(bRole,'/users', function(text){
                    // console.log("All users > "+text);
                    expect(text).to.contain("Email", "Groups", "Roles", "Status", "Campaigns");
                                  done();
                    });
           });



           it('Permissions of a User', function(done){
                   supportapi.fetcher(bRole,'/user/6411/permissions', function(text){
                   // console.log("Permissions of user > "+text);
                   expect(text).to.contain("Permission", "Caller", "Action");
                   done();
                });
           });

           it('Fetch Current User', function(done){
                  supportapi.fetcher(bRole,'/user', function(text){
                  // console.log("Current user > "+text);
                  expect(text).to.contain("Email", "CreatedAt", "CreatedByUserId", "StatusId");
                  done();
                });
           });

           it('User check', function(done){
                   supportapi.fetcher(bRole,'/user/6411', function(text){
                   // console.log("Check user > "+text);
                   expect(text).to.contain("Email", "CreatedAt", "CreatedByUserId", "StatusId");
                   done();
                 });
           });

           it('Existent Email check', function(done){
                   supportapi.fetcher(bRole,'/email/exists/bijupja.na@gmail.com', function(text){
                   expect(text.trim()).to.equal("true");
                   done();
                 });
           });

           it('Non-existent Email check', function(done){
                      supportapi.fetcher(bRole,'/email/exists/simple@gmail.com', function(text){
                      expect(text.trim()).to.equal("false");
                      done();
                  });
           });


           it('User Status', function(done){
                   supportapi.fetcher(bRole,'/user/6411/status', function(text){
                   // console.log("Existent USER Status > "+text);
                   expect(text).to.contain("Id", "Name", "Description");
                   done();
                 });
           });

           it('User Statuses', function(done){
                    supportapi.fetcher(bRole,'/userstatuses', function(text){
                    // console.log("Existent USER Status > "+text);
                    expect(text).to.contain("Draft", "Pending", "Active", "Deleted", "reset_password");
                    done();
                 });
           });

           it('User roles', function(done){
                    supportapi.fetcher(bRole,'/userroles', function(text){
                    // console.log("Existent USER Status > "+text);
                    expect(text).to.contain("normal_user", "group_admin", "blippar_admin", "root_admin", "blippar_user", "bespoke_user", "cc_user", "ad_user", "testing_signup_user", "blippbuilder_flash_user", "blippbuilder_javascript_user", "bespoke_blippbasic_user", "bespoke_javascript_user", "external_developer");
                    done();
                 });
           });

});
